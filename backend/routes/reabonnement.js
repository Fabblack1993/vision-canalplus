const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const {
    numero_abonne,
    formule,
    duree,
    montant,
    telephoneAbonne,
    materialNumber,
    numeroContrat,
  } = req.body;

  const userId = req.user.id;

  const missing = [];
  if (!numero_abonne) missing.push("numero_abonne");
  if (!formule) missing.push("formule");
  if (!duree) missing.push("duree");
  if (!montant) missing.push("montant");
  if (!telephoneAbonne) missing.push("telephoneAbonne");
  if (!materialNumber) missing.push("materialNumber");
  if (!numeroContrat) missing.push("numeroContrat");

  if (missing.length > 0) {
    return res.status(400).json({ error: "Données manquantes", missing });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [users] = await connection.query(
      "SELECT wallet_balance, name FROM users WHERE id = ? FOR UPDATE",
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const user = users[0];

    if (Number(user.wallet_balance) < Number(montant)) {
      await connection.rollback();
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    const fujisatPayload = {
      offreCode: formule,
      numabo: numero_abonne,
      materialNumber,
      duree,
      telephoneAbonne,
      numeroContrat: Number(numeroContrat) || 1,
    };

    console.log("📤 Envoi Fujisat :", fujisatPayload); // ✅ log exact du payload

    let apiResponse;
    try {
      apiResponse = await axios.post(
        `${process.env.FUJISAT_URL}/public-api/operation/re-subscription/renew`,
        fujisatPayload, // ✅ un seul objet, propre
        {
          auth: {
            username: process.env.FUJISAT_USER,
            password: process.env.FUJISAT_PASS
          },
          headers: { "Content-Type": "application/json" },
          timeout: 15000
        }
      );
    } catch (err) {
      console.error("❌ Fujisat ERROR :", err.response?.data || err.message);
      await connection.rollback();
      return res.status(502).json({
        error: "Échec du réabonnement Canal+",
        details: err.response?.data || err.message
      });
    }

    if (!apiResponse.data || apiResponse.data.success !== true) {
      await connection.rollback();
      return res.status(400).json({
        error: "Réabonnement refusé par Canal+",
        details: apiResponse.data
      });
    }

    const newBalance = Number(user.wallet_balance) - Number(montant);

    await connection.query(
      "UPDATE users SET wallet_balance = ? WHERE id = ?",
      [newBalance, userId]
    );

    await connection.query(
      `INSERT INTO reabonnements 
      (users_id, numero_abonne, formule, montant, duree, telephoneAbonne, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, numero_abonne, formule, montant, duree, telephoneAbonne]
    );

    await connection.query(
      "INSERT INTO notifications (type, message, created_at) VALUES (?, ?, NOW())",
      [
        "reabonnement",
        `💰 ${user.name} a réabonné ${numero_abonne} (${formule}) - ${montant} FCFA`
      ]
    );

    await connection.commit();

    const message = encodeURIComponent(
      `Réabonnement Canal+ réussi pour ${numero_abonne} (${formule})`
    );

    return res.json({
      success: true,
      message: "Réabonnement effectué avec succès",
      wallet_balance: newBalance,
      whatsappLink: `https://wa.me/237656253864?text=${message}`,
      apiData: apiResponse.data
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("🔥 ERREUR GLOBALE :", err);
    return res.status(500).json({ error: "Erreur serveur", details: err.message });

  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;




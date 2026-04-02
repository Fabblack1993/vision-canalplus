// routes/reabonnement.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // ta connexion MySQL

// POST /api/reabonnement
router.post("/", async (req, res) => {
  const { users_id, numero_abonne, formule, duree, montant } = req.body;

  // Vérification des donné
  if (!numero_abonne || !formule || !duree || !montant) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  try {
    // 1️⃣ Enregistrement en base
    await pool.query(
      "INSERT INTO reabonnements (users_id, numero_abonne, formule, montant, duree, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [users_id || null, numero_abonne, formule, duree, montant]
    );

    // 2️⃣ Notification admin (dashboard)
    await pool.query(
      "INSERT INTO notifications (type, message, created_at) VALUES (?, ?, NOW())",
      [
        "reabonnement",
        `Réabonnement validé pour l'abonné ${numero_abonne} - Formule: ${formule} - Durée: ${duree} mois - Montant: ${montant} FCFA`
      ]
    );

    // 3️⃣ Génération du lien WhatsApp
    const message = encodeURIComponent(
      `Réabonnement validé pour l'abonné ${numero_abonne} - Formule: ${formule} - Durée: ${duree} mois - Montant: ${montant} FCFA`
    );
    const whatsappLink = `https://wa.me/237656253864?text=${message}`;

    res.json({ success: true, whatsappLink });
  } catch (err) {
    console.error("Erreur réabonnement:", err);
    res.status(500).json({ error: "Erreur lors du réabonnement" });
  }
});

module.exports = router;




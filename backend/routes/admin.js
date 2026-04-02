const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require("bcryptjs");

// ---- Liste de tous les partenaires ----
router.get('/partners', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, prenom, email, role, status, structure, pays, ville, quartier, telephone FROM users WHERE role='partner'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET /partners :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Liste des partenaires en attente ----
router.get('/partners/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, prenom, email, structure, pays, ville, quartier, telephone FROM users WHERE role='partner' AND status='pending'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET /partners/pending :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Statistiques partenaires ----
router.get('/partners/stats', async (req, res) => {
  try {
    const [reabonnements] = await pool.query("SELECT COUNT(*) AS total FROM reabonnements");
    const [reabonnementsJour] = await pool.query("SELECT DATE(created_at) AS jour, COUNT(*) AS total FROM reabonnements GROUP BY jour");
    const [reabonnementsMois] = await pool.query("SELECT MONTH(created_at) AS mois, COUNT(*) AS total FROM reabonnements GROUP BY mois");
    const [reabonnementsAnnee] = await pool.query("SELECT YEAR(created_at) AS annee, COUNT(*) AS total FROM reabonnements GROUP BY annee");
    const [commissions] = await pool.query("SELECT SUM(montant)*0.06 AS total_commission FROM reabonnements");

    res.json({
      abonnements: reabonnements[0].total,
      reabonnementsJour,
      reabonnementsMois,
      reabonnementsAnnee,
      commissions: commissions[0].total_commission
    });
  } catch (err) {
    console.error("Erreur GET /partners/stats :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// Route générique pour réabonnement
router.post("/reabonnement", async (req, res) => {
  const { numero, formule, duree, montant } = req.body;
  try {
    const commission = montant * 0.06;
    await pool.query(
      "INSERT INTO reabonnements (numero, formule, duree, montant, commission, date) VALUES (?, ?, ?, ?, ?, NOW())",
      [numero, formule, duree, montant, commission]
    );
    res.json({ message: "Réabonnement enregistré", commission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour notifier l’admin
router.post("/admin/notifications", async (req, res) => {
  const { type, message, duree } = req.body;
  try {
    await pool.query(
      "INSERT INTO notifications (type, message, duree) VALUES (?, ?, NOW())",
      [type, message, duree]
    );
    res.json({ message: "Notification envoyée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Modifier un partenaire ----
router.put('/partners/:id', async (req, res) => {
  const { id } = req.params;
  const { name, prenom, email, structure, pays, ville, quartier, telephone } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Partenaire introuvable" });

    await pool.query(
      `UPDATE users 
       SET name=?, prenom=?, email=?, structure=?, pays=?, ville=?, quartier=?, telephone=? 
       WHERE id=?`,
      [name, prenom, email, structure, pays, ville, quartier, telephone, id]
    );

    res.json({ message: "Partenaire modifié avec succès" });
  } catch (err) {
    console.error("Erreur PUT /partners/:id :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/partners/:id/reabonnement", async (req, res) => {
  const { formule, montant } = req.body; // nom de la formule + prix
  const usersId = req.params.id;

  try {
    // calcul de la commission
    const commission = Number(montant) * 0.06;

    // enregistrer le réabonnement
    await pool.query(
      "INSERT INTO reabonnements (users_id, formule, montant, commission, created_at) VALUES (?, ?, ?, ?, NOW())",
      [usersId, formule, montant, commission]
    );

    // notifier l’admin
    req.io.emit("reabonnement", { usersId, commission });

    res.json({ message: "Réabonnement enregistré", commission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.post("/partners/:id/validate-reabonnement", async (req, res) => {
  const usersId = req.params.id;

  try {
    // 1️⃣ Récupérer le dernier réabonnement
    const [rows] = await pool.query(
      `SELECT * FROM reabonnements 
       WHERE users_id = ?
       ORDER BY created_at DESC 
       LIMIT 1`,
      [usersId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucun réabonnement trouvé" });
    }

    const reabonnement = rows[0];

    // 2️⃣ Vérifier si déjà validé (grâce à commission)
    if (reabonnement.commission && reabonnement.commission > 0) {
      return res.status(400).json({ error: "Déjà validé" });
    }

    // 3️⃣ Calcul commission (6%)
    const commission = reabonnement.montant * 0.06;

    // 4️⃣ Mise à jour du réabonnement
    await pool.query(
      `UPDATE reabonnements 
       SET commission = ? 
       WHERE id = ?`,
      [commission, reabonnement.id]
    );

    // 5️⃣ Mise à jour du total partenaire
    await pool.query(
      `UPDATE users 
       SET commission_total = commission_total + ? 
       WHERE id = ?`,
      [commission, usersId]
    );

    res.json({
      message: "Réabonnement validé avec succès",
      commission
    });

  } catch (err) {
    console.error("Erreur validation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// ---- Supprimer un partenaire ----
router.delete('/partners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "Partenaire supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE /partners/:id :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Valider un partenaire ----
router.put('/partners/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE users SET status='approved' WHERE id=?", [id]);
    res.json({ message: "Partenaire validé" });
  } catch (err) {
    console.error("Erreur PUT /partners/:id/approve :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Rejeter un partenaire ----
router.put('/partners/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE users SET status='rejected' WHERE id=?", [id]);
    res.json({ message: "Partenaire rejeté" });
  } catch (err) {
    console.error("Erreur PUT /partners/:id/reject :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Créer un partenaire directement ----
router.post("/partners", async (req, res) => {
  const { name, prenom, structure, pays, ville, quartier, telephone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, prenom, structure, pays, ville, quartier, telephone, email, password, role, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'partner', 'pending')`,
      [name, prenom, structure, pays, ville, quartier, telephone, email, hashedPassword]
    );
    res.json({ message: "Partenaire ajouté avec succès" });
  } catch (err) {
    console.error("Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


module.exports = router;

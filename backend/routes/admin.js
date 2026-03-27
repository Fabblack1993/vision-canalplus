const express = require('express');
const pool = require('../db');
const router = express.Router();

// Liste des partenaires en attente
router.get('/partners/pending', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE role='partner' AND status='pending'");
  res.json(rows);
});

// Valider un partenaire
router.put('/partners/:id/approve', async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE users SET status='approved' WHERE id=?", [id]);
  res.json({ message: "Partenaire validé" });
});

// Rejeter un partenaire
router.put('/partners/:id/reject', async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE users SET status='rejected' WHERE id=?", [id]);
  res.json({ message: "Partenaire rejeté" });
});

// Créer un partenaire directement
router.post('/partners', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'partner', 'approved')",
    [name, email, hashedPassword]
  );
  res.json({ message: "Partenaire créé et validé" });
});

module.exports = router;

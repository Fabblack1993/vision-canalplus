const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// ---- INSCRIPTION ----
router.post('/register', async (req, res) => {
  const { nom, prenom, structure, pays, ville, quartier, telephone, motDePasse, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    await pool.query(
      `INSERT INTO users 
      (name, prenom, structure, pays, ville, quartier, telephone, email, password, role, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'partner', 'pending')`,
      [nom, prenom, structure, pays, ville, quartier, telephone, email, hashedPassword]
    );

    res.json({ message: "Inscription réussie, en attente de validation par l'admin." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- LOGIN ----
router.post('/login', async (req, res) => {
  const { nom, contact, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE (email=? OR telephone=?) AND name=?",
      [contact, contact, nom]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ message: "Compte en attente de validation par l'admin" });
    }

  const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


    res.json({ token, role: user.role, message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


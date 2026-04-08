const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();



// ---- INSCRIPTION ----

router.post("/register", async (req, res) => {
  const { name, prenom, structure, pays, ville, quartier, telephone, password, email, codePromo } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // On ne valide pas le code promo ici, on l'envoie juste à l'admin
    await pool.query(
      `INSERT INTO users 
      (name, prenom, structure, pays, ville, quartier, telephone, email, password, role, status, codePromo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'partner', 'pending', ?)`,
      [name, prenom, structure, pays, ville, quartier, telephone, email, hashedPassword, codePromo || null]
    );

    res.json({ 
      message: "Inscription réussie, en attente de validation par l'administrateur."
    });
  } catch (err) {
    console.error("Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// ---- LOGIN ----
router.post("/login", async (req, res) => {
  const { name, contact, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE (email = ? OR telephone = ?) AND name = ? LIMIT 1",
      [contact, contact, name]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Utilisateur introuvable" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ success: false, message: "Compte en attente de validation par l'admin" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      role: user.role
    });
  } catch (err) {
    console.error("Erreur login :", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});


// Express.js
router.post("/auth/forgot-password", async (req, res) => {
  const { contact } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR telephone = ? LIMIT 1",
      [contact, contact]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Utilisateur introuvable" });
    }

    const user = rows[0];
    const resetCode = Math.floor(100000 + Math.random() * 900000);

    await pool.query(
      "UPDATE users SET resetCode = ?, resetCodeExpires = ? WHERE id = ?",
      [resetCode, Date.now() + 10 * 60 * 1000, user.id]
    );

    // Envoi SMS via ton service (Twilio ou autre)
    sendSms(contact, `Votre code de réinitialisation est : ${resetCode}`);

    res.json({ success: true, message: "Code envoyé par SMS" });
  } catch (err) {
    console.error("Erreur forgot-password :", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});


module.exports = router;


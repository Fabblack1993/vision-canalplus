const express = require("express");
const auth = require("../middleware/auth");
const pool = require("../db"); // ✅ IMPORTANT

const router = express.Router();

router.get("/partner/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id; // récupéré via le token

    const [rows] = await pool.query(
      "SELECT name, wallet_balance FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const user = rows[0];

    res.json({
      message: `Bienvenue ${user.name}`,
      wallet_balance: user.wallet_balance
    });

  } catch (err) {
    console.error("Erreur dashboard partenaire :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;


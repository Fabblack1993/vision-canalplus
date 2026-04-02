const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/partner/dashboard", auth, (req, res) => {
  res.json({ message: "Bienvenue sur ton dashboard partenaire !" });
});

module.exports = router;


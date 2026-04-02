const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/search", async (req, res) => {
  const { numero } = req.body;

  try {
    const response = await axios.post(
      `${process.env.FUJISAT_URL}/public-api/abonne/search`,
      {
        numabo: "",
        numdecabo: numero,
        emailabo: "",
        telabo: ""
      },
      {
        auth: {
          username: process.env.FUJISAT_USER,
          password: process.env.FUJISAT_PASS
        },
        headers: { "Content-Type": "application/json" }
      }
    );

    const data = response.data;

    // Vérifie si data contient un tableau
    const abonneRaw = Array.isArray(data?.data) ? data.data[0] : null;

    if (!abonneRaw) {
      return res.status(404).json({ error: "Abonné introuvable" });
    }

    
    const abonne = {
      numeroAbonne: abonneRaw.numabo,
      nom: abonneRaw.nomabo,
      prenom: abonneRaw.prenomabo,
      pays: abonneRaw.paysabo,
      ville: abonneRaw.villabo,
      adresse: abonneRaw.adresseabo,
      telephone: abonneRaw.telepohoneabo,
      bouquet: abonneRaw.optionmajeureabo,
      numdecabo: abonneRaw.clabo,
      debutAbonnement: abonneRaw.debabo,
      finAbonnement: abonneRaw.finabo,
      statut: data.status
    };

    res.json({ abonne });
  } catch (err) {
    console.error("Erreur Fujisat:", err.response?.data || err.message);
    res.status(500).json({ error: "Erreur Canal+" });
  }
});

module.exports = router;


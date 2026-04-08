const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

router.post("/search", async (req, res) => {
  const { numero } = req.body;
  if (!numero || numero.trim() === "") {
    return res.status(400).json({ error: "Numéro de décodeur requis" });
  }

  try {
    const response = await axios.post(
      `${process.env.FUJISAT_URL}/public-api/abonne/search`,
      {
        numabo: "",
        numdecabo: numero.trim(),
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

    if (!Array.isArray(data?.data) || data.data.length === 0) {
      return res.status(404).json({ error: "Abonné introuvable" });
    }

    const abonneRaw = data.data[0];

    console.log("abonneRaw:", JSON.stringify(abonneRaw, null, 2)); // ✅ debug

    const abonne = {
      numdecabo: abonneRaw.clabo || "",
      numabo: abonneRaw.numabo || "",
      nom: abonneRaw.nomabo || "",
      prenom: abonneRaw.prenomabo || "",
      name: `${abonneRaw.prenomabo || ""} ${abonneRaw.nomabo || ""}`.trim(),
      telephone: abonneRaw.telepohoneabo
              || abonneRaw.telephoneAbonne
              || abonneRaw.telabo
              || abonneRaw.telephoneabo
              || abonneRaw.telephone1
              || abonneRaw.telephone2
              || "",
      address: [
        abonneRaw.adresseabo || "",
        abonneRaw.villabo || "",
        abonneRaw.paysabo || ""
      ].filter(Boolean).join(", "),
      email: abonneRaw.emailabo || "",
      status: abonneRaw.annuleabo || "inconnu",  // ✅ corrigé
      bouquet: abonneRaw.optionmajeureabo || "",
      debutAbonnement: abonneRaw.debabo || null,
      finAbonnement: abonneRaw.finabo || null,
      numeroContrat: abonneRaw.numeroContrat || abonneRaw.cabo || null,  // ✅ corrigé
    };

    res.json({ abonne });

  } catch (err) {
    console.error("Erreur Fujisat:", err.response?.data || err.message);
    res.status(500).json({ error: "Erreur Canal+" });
  }
});

module.exports = router;


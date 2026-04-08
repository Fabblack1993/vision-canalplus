const express = require('express');
const cors = require('cors');
require("dotenv").config();

const authRoutes = require("./routes/auth");
const dashboardRoutes = require('./routes/dashboard');
const reabonnementRoutes = require("./routes/reabonnement");
const adminRoutes = require("./routes/admin");
const abonneRoutes = require("./routes/abonne");



const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use("/api/reabonnement", reabonnementRoutes);
app.use("/api", adminRoutes);
app.use("/api/abonne", abonneRoutes);

app.listen(5000, () => console.log("Serveur démarré sur http://localhost:5000"));

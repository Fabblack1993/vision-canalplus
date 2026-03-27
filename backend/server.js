const express = require('express');
const cors = require('cors');
require("dotenv").config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);

app.listen(5000, () => console.log("Serveur démarré sur http://localhost:5000"));

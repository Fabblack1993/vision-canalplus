import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const statistique = [
  { formule: "Access", commissions: 12000 },
  { formule: "Evasion", commissions: 25000 },
  { formule: "Essentiel", commissions: 40000 },
  { formule: "Tout Canal+", commissions: 60000 },
];

export default function PartnerDashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 📊 Données mock (remplacer par MySQL plus tard)
  const stats = [
    { name: "Jan", abonnements: 30 },
    { name: "Fév", abonnements: 50 },
    { name: "Mar", abonnements: 70 },
    { name: "Avr", abonnements: 40 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/partner/dashboard", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Erreur de connexion au dashboard"));
  }, []);

const [wallet, setWallet] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:5000/api/partner/dashboard", {
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then(res => res.json())
      .then(data => setWallet(data.wallet_balance));
  }, 3000);

  return () => clearInterval(interval);
}, []);

  return (
    
    <div className="min-h-screen bg-gray-900 p-6">

      {/* 🔝 HEADER */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Dashboard Partenaire</h1>
        <p className="text-gray-300 mt-2">{message}</p>
      </div>

      {/* 📊 CARTES STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center text-white">
          <h2 className="font-bold">Clients</h2>
          <p className="text-2xl">120</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg text-center text-white">
          <h2 className="font-bold">Réabonnements</h2>
          <p className="text-2xl">45</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg text-center text-white">
          <h2 className="font-bold">Revenus</h2>
          <p className="text-2xl">350K</p>
        </div>

        <div className="bg-green-600 p-4 rounded-lg text-center text-white">
  <h2 className="font-bold">Portefeuille</h2>
  <p className="text-2xl">{wallet} FCFA</p>
</div>
      </div>

      {/* 🔘 ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => navigate("/abonnement")}
          className="bg-gray-700 text-white p-4 rounded shadow hover:bg-gray-600"
        >
          Abonnement
        </button>

        <button
          onClick={() => navigate("/reabonnement")}
          className="bg-gray-700 text-white p-4 rounded shadow hover:bg-gray-600"
        >
          Réabonnement
        </button>

        <button
          onClick={() => navigate("/boutique")}
          className="bg-gray-700 text-white p-4 rounded shadow hover:bg-gray-600"
        >
          Produits Canal+
        </button>

        <a
          href="https://wa.me/237656253864"
          target="_blank"
          className="bg-gray-700 text-white p-4 rounded shadow hover:bg-gray-600 text-center"
        >
          Technicien
        </a>
      </div>

     
    </div>
  );
}

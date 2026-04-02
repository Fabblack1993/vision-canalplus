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

        <div className="bg-gray-800 p-4 rounded-lg text-center text-white">
          <h2 className="font-bold">Produits</h2>
          <p className="text-2xl">12</p>
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
          Assistance
        </a>
      </div>

      {/* 📊 GRAPHIQUE */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
          Commissions par formule Canal+
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={statistique}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="formule"
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip formatter={(value) => `${value} FCFA`} />
            <Legend />
            <Bar dataKey="commissions" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

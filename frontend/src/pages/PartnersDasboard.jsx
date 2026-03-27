import React, { useEffect, useState } from "react";

export default function PartnerDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Récupérer le token stocké après login
    const token = localStorage.getItem("token");

    // Vérifier le token en appelant une route protégée
    fetch("http://localhost:5000/partner/dashboard", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Erreur de connexion au dashboard"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Partenaire
        </h1>
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
  <div className="bg-blue-100 p-4 rounded-lg text-center">
    <h2 className="text-lg font-bold">Clients</h2>
    <p className="text-2xl">120</p>
  </div>
  <div className="bg-green-100 p-4 rounded-lg text-center">
    <h2 className="text-lg font-bold">Projets</h2>
    <p className="text-2xl">8</p>
  </div>
</div>

    </div>
    
  );
}

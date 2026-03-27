import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Admin
        </h1>
        <p className="text-gray-700">
          Bienvenue administrateur, vous pouvez gérer les partenaires ici.
        </p>
      </div>
    </div>
  );
}

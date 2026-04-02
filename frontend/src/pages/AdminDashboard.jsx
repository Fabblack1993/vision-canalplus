import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
const [commissionTotal, setCommissionTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [chartData, setChartData] = useState([]);
const [reabonnementTotal, setReabonnementTotal] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    prenom: "",
    structure: "",
    pays: "",
    ville: "",
    quartier: "",
    telephone: "",
    email: "",
    password: ""
  });

const fetchStats = async () => {
  try {
    const res1 = await axios.get("http://localhost:5000/api/stats/abonnements-mensuels");
    const res2 = await axios.get("http://localhost:5000/api/stats/reabonnements-total");

    setChartData(res1.data);
    setReabonnementTotal(res2.data.total);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchPartners();
  fetchStats();
}, []);

  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 5;

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    structure: "",
    pays: "",
    ville: "",
    quartier: "",
    telephone: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/partners");
      setPartners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================
  const approvePartner = async (id) => {
    await axios.put(`http://localhost:5000/api/partners/${id}/approve`);
    fetchPartners();
  };

  const rejectPartner = async (id) => {
    await axios.put(`http://localhost:5000/api/partners/${id}/reject`);
    fetchPartners();
  };

  const deletePartner = async (id) => {
    await axios.delete(`http://localhost:5000/api/partners/${id}`);
    fetchPartners();
  };

  const addPartner = async () => {
    try {
      await axios.post("http://localhost:5000/api/partners", newPartner);
      alert("Partenaire ajouté avec succès !");
      fetchPartners();
      setShowForm(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      alert("Échec de l'ajout : " + err.message);
    }
  };

  const openEditForm = (p) => {
    setEditId(p.id);
    setEditData({
      name: p.name,
      email: p.email,
      structure: p.structure,
      pays: p.pays,
      ville: p.ville,
      quartier: p.quartier,
      telephone: p.telephone
    });
    setShowEdit(true);
  };

  const saveEdit = async () => {
    await axios.put(`http://localhost:5000/api/partners/${editId}`, editData);
    setShowEdit(false);
    fetchPartners();
  };


const validateReabonnement = async (id) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/partners/${id}/validate-reabonnement`,
      { formulePrix: 10000 } // exemple prix formule
    );
    setCommissionTotal(prev => prev + res.data.commission);
    fetchPartners();
  } catch (err) {
    console.error("Erreur validation :", err);
    alert("Échec validation réabonnement");
  }
};


  // ================= FILTRE =================
  const filteredPartners = partners.filter((p) => {
    const matchSearch =
      (p.name?.toLowerCase().includes(search.toLowerCase())) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()));

    const matchFilter = filter === "all" || p.status === filter;

    return matchSearch && matchFilter;
  });

  // ================= PAGINATION =================
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner);
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  // ================= KPIs =================
  
  const total = partners.length;
  const approved = partners.filter(p => p.status === "approved").length;
  const pending = partners.filter(p => p.status === "pending").length;
  const rejected = partners.filter(p => p.status === "rejected").length;

  if (loading) return <p className="text-white text-center">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
<div className="bg-gray-800 p-4 rounded mb-6">
  <h2 className="text-xl mb-4">Abonnements mensuels</h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
      <CartesianGrid stroke="#444" />
      <XAxis dataKey="month" stroke="#ccc" />
      <YAxis stroke="#ccc" />
      <Tooltip />
      <Line type="monotone" dataKey="abonnements" stroke="#3b82f6" strokeWidth={3} />
    </LineChart>
  </ResponsiveContainer>
</div>

      {/* ===== KPIs ===== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded"><p>Total</p><h2 className="text-2xl">{total}</h2></div>
        <div className="bg-green-600 p-4 rounded"><p>Validés</p><h2 className="text-2xl">{approved}</h2></div>
        <div className="bg-yellow-500 p-4 rounded"><p>En attente</p><h2 className="text-2xl">{pending}</h2></div>
        <div className="bg-red-600 p-4 rounded"><p>Rejetés</p><h2 className="text-2xl">{rejected}</h2></div>
        <div className="bg-blue-600 p-4 rounded">
  <p>Commission totale</p>
  <h2 className="text-2xl">{commissionTotal} FCFA</h2>
</div>

      </div>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Rechercher..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="p-2 rounded bg-gray-700" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded bg-gray-700">
          <option value="all">Tous</option>
          <option value="approved">Validés</option>
          <option value="pending">En attente</option>
          <option value="rejected">Rejetés</option>
        </select>
        <button onClick={() => setShowForm(true)} className="bg-white text-black px-4 rounded">+ Ajouter</button>
      </div>

      {/* ===== TABLE ===== */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Prénom</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Structure</th>
            <th className="px-4 py-2 text-left">Pays</th>
            <th className="px-4 py-2 text-left">Ville</th>
            <th className="px-4 py-2 text-left">Quartier</th>
            <th className="px-4 py-2 text-left">Téléphone</th>
            <th className="px-4 py-2 text-left">Statut</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPartners.map((p) => (
            <tr key={p.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.prenom}</td>
              <td className="px-4 py-2">{p.email}</td>
              <td className="px-4 py-2">{p.structure || "—"}</td>
              <td className="px-4 py-2">{p.pays || "—"}</td>
              <td className="px-4 py-2">{p.ville || "—"}</td>
              <td className="px-4 py-2">{p.quartier || "—"}</td>
              <td className="px-4 py-2">{p.telephone || "—"}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded ${
                  p.status === "approved" ? "bg-green-500" :
                  p.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button onClick={() => approvePartner(p.id)}>✔</button>
                <button onClick={() => rejectPartner(p.id)}>✖</button>
                <button onClick={() => openEditForm(p)}>✏️</button>
                <button onClick={() => deletePartner(p.id)}>🗑</button>
                
        <button
  onClick={() => validateReabonnement(p.id)}
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
>
  <span>Valider réabonnement</span>
  <svg xmlns="http://www.w3.org/2000/svg" 
       className="h-5 w-5" 
       fill="none" 
       viewBox="0 0 24 24" 
       stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
</button>
              </td>
            </tr>
          ))}
        </tbody>
      
</table>

<div className="flex justify-center items-center mt-4 space-x-2">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
  >
    Précédent
  </button>

  <span>Page {currentPage} / {totalPages}</span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
  >
    Suivant
  </button>
</div>





      {/* ===== MODAL ADD ===== */}
      {showForm && (
        <div className="bg-gray-800 p-4 mt-4 rounded">
          <input placeholder="Nom" onChange={(e)=>setNewPartner({...newPartner, name:e.target.value})}/>
<input placeholder="Prénom" onChange={(e)=>setNewPartner({...newPartner, prenom:e.target.value})}/>
<input placeholder="Email" onChange={(e)=>setNewPartner({...newPartner, email:e.target.value})}/>
<input placeholder="Structure" onChange={(e)=>setNewPartner({...newPartner, structure:e.target.value})}/>
<input placeholder="Pays" onChange={(e)=>setNewPartner({...newPartner, pays:e.target.value})}/>
<input placeholder="Ville" onChange={(e)=>setNewPartner({...newPartner, ville:e.target.value})}/>
<input placeholder="Quartier" onChange={(e)=>setNewPartner({...newPartner, quartier:e.target.value})}/>
<input placeholder="Téléphone" onChange={(e)=>setNewPartner({...newPartner, telephone:e.target.value})}/>
<input placeholder="Password" onChange={(e)=>setNewPartner({...newPartner, password:e.target.value})}/>

          <button onClick={addPartner}>Créer</button>
        </div>
      )}

      {/* ===== MODAL EDIT ===== */}
      {showEdit && (
        <div className="bg-gray-800 p-4 mt-4 rounded">
          <input value={editData.name} onChange={(e)=>setEditData({...editData,name:e.target.value})}/>
          <input value={editData.email} onChange={(e)=>setEditData({...editData,email:e.target.value})}/>
          <input value={editData.structure} onChange={(e)=>setEditData({...editData,structure:e.target.value})}/>
          <input value={editData.country} onChange={(e)=>setEditData({...editData,country:e.target.value})}/>
          <button onClick={saveEdit}>Sauvegarder</button>
        </div>
      )}

    </div>
  );
}
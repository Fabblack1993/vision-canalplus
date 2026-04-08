import { useState } from "react";
import axios from "axios";



const offres = [
  { name: "Access",      price: 5000 },
  { name: "Evasion",     price: 10000 },
  { name: "Access+",     price: 15000 },
  { name: "Evasion+",    price: 20000 },
  { name: "Tout Canal+", price: 25000 },
];

export default function Reabonnement() {
  const [numero, setNumero] = useState("");
  const [client, setClient] = useState(null);
  const [formule, setFormule] = useState("");
  const [duree, setDuree] = useState(1);
  const [montant, setMontant] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- Fonctions utilitaires ---
 const mapFormule = (name) => {
  switch (name) {
    case "Access":      return "ACDD";
    case "Evasion":     return "EVDD";
    case "Access+":     return "ACPDD";
    case "Evasion+":    return "EVPDD";
    case "Tout Canal+": return "TCADD";
    default: return name;
  }
};

  const formatPhone = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");

    // Si commence par 237 → ajouter 00 devant
    if (clean.startsWith("237") && clean.length === 12) clean = "00" + clean;

    // Si commence déjà par 00237 et 14 chiffres → OK
    if (clean.startsWith("00237") && clean.length === 14) return clean;

    // Si c’est juste 9 chiffres → ajouter 00237 devant
    if (clean.length === 9) return "00237" + clean;

    // Autres cas → invalide
    return "";
  };

  // --- Recherche client ---
  const searchClient = async () => {
    if (!numero || numero.trim() === "") {
      alert("Entrez un numéro valide");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/abonne/search", { numero: numero.trim() });
      if (res.data?.abonne) {
        setClient(res.data.abonne);
      } else {
        alert("Abonné introuvable");
        setClient(null);
      }
    } catch (err) {
      alert("Erreur lors de la recherche.");
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Gestion formule et durée ---
  const handleFormuleChange = (value) => {
    setFormule(value);
    const offre = offres.find(o => o.name === value);
    if (offre) setMontant(offre.price * duree);
  };

  const handleDureeChange = (value) => {
    setDuree(value);
    const offre = offres.find(o => o.name === formule);
    if (offre) setMontant(offre.price * value);
  };

  // --- Soumission du réabonnement ---
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Utilisateur non connecté");
    return;
  }

  // Vérifications...
  const dureeNumber = Number(duree);
  const offre = offres.find(o => o.name === formule);
  const montantFinal = offre ? offre.price * dureeNumber : 0;

  const tel = formatPhone(client?.manualPhone || client?.telephone || numero);
  if (!tel || tel.length !== 14) {
    alert("Téléphone invalide. Format attendu: 00237xxxxxxxxx");
    return;
  }
const numeroContrat = client?.numeroContrat || 1; // ✅ dynamique

const payload = {
  userId: localStorage.getItem("userId"),
  numero_abonne: client?.numabo || "",
  formule: mapFormule(formule),
  duree: dureeNumber,
  montant: montantFinal,
  telephoneAbonne: tel,
  materialNumber: client?.numdecabo,
  numeroContrat: Number(numeroContrat),       // ✅ depuis le client
         // ✅ bouquet = optionmajeureabo
};
  

  try {
    const res = await axios.post("http://localhost:5000/api/reabonnement", payload, {
    headers: { Authorization: `Bearer ${token}` }

    });

    if (res.data.success) {
      alert("Réabonnement validé ✅");
      console.log("Nouveau solde :", res.data.wallet_balance);
      if (res.data.whatsappLink) window.open(res.data.whatsappLink, "_blank");
      // reset
      setNumero(""); setClient(null); setFormule(""); setDuree(1); setMontant(0);
    } else {
      alert(res.data.message || res.data.error || "Erreur lors du réabonnement");
    }
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Session expirée, veuillez vous reconnecter.");
      navigate("/login");
    } else {
      console.error("Erreur backend:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Erreur lors du réabonnement");
    }
  }
};



  // --- JSX ---
  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-4 text-center">Réabonnement Canal+ Cameroun</h2>

        {/* Recherche client */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Numéro abonné"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button onClick={searchClient} className="bg-blue-600 text-white px-4 rounded">
            Rechercher
          </button>
        </div>

        {loading && <p>Recherche en cours...</p>}

        {/* Infos client */}
        {client && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p><strong>Nom :</strong> {client.name}</p>
            <p><strong>Statut :</strong> {String(client.status)}</p>
            <p><strong>Numéro abonné :</strong> {client.numabo}</p>
<p><strong>Numéro décodeur :</strong> {client.numdecabo}</p>
            <p><strong>Adresse :</strong> {client.address}</p>
            <p><strong>Email :</strong> {client.email}</p>
            <p><strong>Téléphone :</strong> {client.telephone || "Non renseigné"}</p>
            <p><strong>Numéro de contrat :</strong> {client.numeroContrat || "1"}</p>

          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-2 border rounded"
            value={formule}
            onChange={(e) => handleFormuleChange(e.target.value)}
            required
          >
            <option value="">Choisir une formule</option>
            {offres.map(o => (
              <option key={o.name} value={o.name}>
                {o.name} - {o.price} FCFA
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={duree}
            onChange={(e) => handleDureeChange(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Durée (mois)"
          />

          <div className="bg-green-50 p-3 rounded text-center">
            <p className="text-lg font-bold">Montant : {montant} FCFA</p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Valider le réabonnement
          </button>

        </form>
      </div>
    </div>
  );
}
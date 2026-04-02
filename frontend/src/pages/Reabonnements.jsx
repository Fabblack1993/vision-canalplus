import { useState } from "react";
import axios from "axios";

const offres = [
  { name: "Access", price: 5000 },
  { name: "Evasion", price: 10000 },
  { name: "Essentiel", price: 15000 },
  { name: "Tout Canal+", price: 25000 }
];

export default function Reabonnement() {
  const [numero, setNumero] = useState("");
  const [client, setClient] = useState(null);
  const [formule, setFormule] = useState("");
  const [duree, setDuree] = useState(1);
  const [montant, setMontant] = useState(0);
  const [loading, setLoading] = useState(false);

  

  // 🔍 Rechercher abonné via API Canal+
  const searchClient = async () => {
    if (!numero || numero.trim() === "") {
      alert("Entrez un numéro valide");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/abonne/search", { numero: numero.trim() });

      console.log("Réponse API :", res.data);

      if (res.data?.abonne) {
        setClient(res.data.abonne);
      } else {
        alert("Abonné introuvable");
        setClient(null);
      }
    } catch (err) {
      console.error("Erreur recherche abonné :", err.response?.data || err.message);
      alert("Erreur lors de la recherche. Vérifiez votre connexion ou le numéro saisi.");
      setClient(null);
    } finally {
      setLoading(false);
    }
  };



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

  // ✅ Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reabonnement", {
        numero, formule, duree, montant
      });

      alert("Réabonnement validé ! Vous allez être redirigé vers WhatsApp.");
      
      // 🔗 Redirection WhatsApp
      window.open(`https://wa.me/237656253864?text=Réabonnement+validé+pour+${numero}`, "_blank");

      // 🔄 Réinitialiser le formulaire
      setNumero("");
      setClient(null);
      setFormule("");
      setDuree(1);
      setMontant(0);

    } catch (err) {
      console.error(err);
      alert("Erreur lors du réabonnement");
    }
  };

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
            <p><strong>Numéro décodeur :</strong> {client.numdecabo}</p>
            <p><strong>Adresse :</strong> {client.address}</p>
            <p><strong>Email :</strong> {client.email}</p>
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
  type="button"
  onClick={async () => {
    try {
      // ⚡️ on stocke la réponse dans res
      const res = await axios.post("http://localhost:5000/api/reabonnement", {
        users_id: 2, // ou l’ID du partenaire connecté
        numero_abonne: numero, // correspond à la colonne numero_abonne
        formule,
        duree,
        montant
      });

      alert("Réabonnement validé !");

      // 🔗 Redirection WhatsApp avec le lien renvoyé par le backend
      if (res.data?.whatsappLink) {
        window.open(res.data.whatsappLink, "_blank");
      }

      // 🔄 Réinitialiser le formulaire
      setNumero("");
      setClient(null);
      setFormule("");
      setDuree(1);
      setMontant(0);

    } catch (err) {
      console.error(err);
      alert("Erreur lors du réabonnement");
    }
  }}
  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
>
  Valider le réabonnement
</button>
  
        </form>

      </div>
    </div>
  );
}
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import produit1Img from "../assets/kit.jpg";
import produit2Img from "../assets/cfg.jpg";
import produit3Img from "../assets/inst.jpg";

export default function Boutique() {
  const produits = [
    {
      title: "Décodeur Canal+",
      description: "Profitez de plus de 280 chaînes TV et radio.",
      price: "25 000 FCFA",
      image: produit1Img,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20le%20Décodeur%20Canal+"
    },
    {
      title: "Carte Abonnement",
      description: "Accédez à vos programmes préférés pendant 1 mois.",
      price: "10 000 FCFA",
      image: produit2Img,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20une%20Carte%20Abonnement"
      
    },
    {
      title: "Kit Installation",
      description: "Comprend parabole, câbles et installation complète.",
      price: "40 000 FCFA",
      image: produit3Img,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20le%20Kit%20Installation"
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen pt-28 px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Boutique Canal+
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {produits.map((produit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
            >
              <img
                src={produit.image}
                alt={produit.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {produit.title}
                </h2>
                <p className="text-gray-600">{produit.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{produit.price}</p>

                {/* ✅ Bouton Achat vers WhatsApp */}
                <a
                  href={produit.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Achat via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </>
  );
}

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import telecommandeImg from "../assets/tlc.jpg";
import chargeurImg from "../assets/chargeur.jpg";
import hdmiImg from "../assets/hdmi.jpg";
import lnbImg from "../assets/lnb.jpg";
import cableImg from "../assets/cable.jpg";
import parafoudreImg from "../assets/paraf.jpg";

export default function Boutique() {
  const produits = [
    {
      title: "Télécommande",
      description: "Télécommande Canal+ universelle.",
      price: "2 000 FCFA",
      image: telecommandeImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20une%20Télécommande"
    },
    {
      title: "Chargeur",
      description: "Chargeur officiel pour décodeur Canal+.",
      price: "5 000 FCFA",
      image: chargeurImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20un%20Chargeur"
    },
    {
      title: "Cordon HDMI",
      description: "Câble HDMI haute qualité pour décodeur.",
      price: "1 000 FCFA",
      image: hdmiImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20un%20Cordon%20HDMI"
    },
    {
      title: "Tête LNB",
      description: "Tête LNB pour parabole Canal+.",
      price: "5 000 FCFA",
      image: lnbImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20une%20Tête%20LNB"
    },
    {
      title: "Câble",
      description: "Câble coaxial pour installation Canal+.",
      price: "5 000 FCFA",
      image: cableImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20un%20Câble"
    },
    {
      title: "Parafoudre",
      description: "Protection électrique pour décodeur Canal+.",
      price: "3 000 FCFA",
      image: parafoudreImg,
      whatsapp: "https://wa.me/237656253864?text=Je%20veux%20acheter%20un%20Parafoudre"
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen pt-16 px-6">
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
                className="w-full h-36 object-contain bg-gray-100"
              />
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {produit.title}
                </h2>
                <p className="text-gray-600">{produit.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{produit.price}</p>

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

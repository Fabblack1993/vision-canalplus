 import { Routes, Route } from "react-router-dom";
 
 function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Bienvenue sur mon App 🚀</h1>
        <p className="text-lg mb-6">Ceci est la page d’accueil de ton application React + TailwindCSS.</p>
        <a
          href="/about"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-200"
        >
          Découvrir plus
        </a>
      </div>
    </div>
  );
}

export default Home;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/loginForm.css"; 

function LoginForm() {
  const [name, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Connexion réussie !");

        // Redirection selon le rôle
        if (data.role === "partner") {
          navigate("/partner/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  const handleForgotPassword = async () => {
  const phone = prompt("Veuillez entrer votre numéro de téléphone pour réinitialiser votre mot de passe :");

  if (!phone) return alert("Numéro de téléphone requis");

  try {
    const response = await fetch("http://localhost:5000/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: phone }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Un code de réinitialisation a été envoyé à votre numéro de téléphone !");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation :", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form
    className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
    onSubmit={handleSubmit}
  >
    <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>

    <input
      type="text"
      placeholder="Nom"
      value={name}
      onChange={(e) => setNom(e.target.value)}
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      type="text"
      placeholder="Email ou Téléphone"
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      type="password"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

   <button
  type="submit"
  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors duration-200"
>
  Se connecter
</button>

    <p
      className="text-blue-500 text-sm text-center mt-4 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-200"
      onClick={handleForgotPassword}
    >
      Mot de passe oublié ?
    </p>
  </form>
</div>
  );
}

export default LoginForm;


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

  return (
    <div className="container">
      <form className="form"onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="text"
          placeholder="Email ou Téléphone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginForm;


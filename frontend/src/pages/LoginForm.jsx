import { useState } from "react";
import "../styles/loginForm.css"; 


function LoginForm() {
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ nom, contact, password });
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <input
          type="text"
          placeholder="Nom"
          value={nom}
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
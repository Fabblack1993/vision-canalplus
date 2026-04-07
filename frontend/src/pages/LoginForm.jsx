import { useState } from "react";
import "../styles/loginForm.css"; 


function LoginForm() {
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  

  const handleSubmit = (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!nom) newErrors.nom = true;
  if (!contact) newErrors.contact = true;
  if (!password) newErrors.password = true;
   console.log("Errors:", newErrors);

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    console.log({ nom, contact, password });
  }
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
           className={errors.nom ? "error" : ""}
        />

        <input
          type="text"
          placeholder="Email ou Téléphone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={errors.contact ? "error" : ""}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
           className={errors.password ? "error" : ""}
        />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginForm;
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import InscriptionPartenaire from "./pages/Inscription"
=======
<<<<<<< HEAD
import LoginForm from "./pages/LoginForm";

function App() {
  return <LoginForm />;
=======
import { useState } from 'react'
import './App.css'
import InscriptionPartenaire from './pages/Inscription.jsx'
>>>>>>> d6d02aafcd4fed8ea63726e05f6f6e41d7902506

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/about">About</Link>
         <Link to="/Inscription">Inscription</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
         <Route path="/Inscription" element={<InscriptionPartenaire />} />
      </Routes>
    </BrowserRouter>
  )
>>>>>>> da78644b5ed3b4eff5d96e2808bf5de55ceef5d0
}

<<<<<<< HEAD
export default App
=======
export default App;
>>>>>>> d6d02aafcd4fed8ea63726e05f6f6e41d7902506

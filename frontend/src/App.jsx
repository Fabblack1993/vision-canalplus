import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import InscriptionPartenaire from "./pages/Inscription"

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
}

export default App
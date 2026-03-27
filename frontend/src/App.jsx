
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import InscriptionPartenaire from "./pages/Inscription"
import LoginForm from "./pages/LoginForm";
import Services from "./pages/Services";
import PartnerDashboard from "./pages/PartnersDasboard";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
     

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
         <Route path="/Inscription" element={<InscriptionPartenaire />} />
         <Route path="/LoginForm" element={<LoginForm />} />
         <Route path="/services" element={<Services />} />
         <Route path="/partner/dashboard" element={<PartnerDashboard />} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App


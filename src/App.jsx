import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import Work from "./components/Work"
import About from "./components/About"
import Services from "./components/Services"
import Contact from "./components/Contact"
import DomainPage from "./components/DomainPage"
import CursorGlow from "./components/CursorGlow"
import AdminPanel from "./components/AdminPanel"

function App() {
  const location = useLocation();

  return (
    <>
      <CursorGlow />
      <Navbar />
      
      {/* Persist homepage in the background unless we are in the admin panel */}
      {location.pathname !== '/admin' && (
        <div className="w-full">
          <Hero />
          <TechStack />
          <Work />
          <About />
          <Services />
          <Contact />
        </div>
      )}

      <Routes>
        <Route path="/work/:domainId" element={<DomainPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  )
}

export default App


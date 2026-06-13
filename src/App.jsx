import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import TechStack from "./components/TechStack"
import ApertureToolkit from "./components/sections/ApertureToolkit"
import Work from "./components/Work"
import About from "./components/About"
import Services from "./components/Services"
import Contact from "./components/Contact"
import DomainPage from "./components/DomainPage"
import CursorGlow from "./components/CursorGlow"
import AdminPanel from "./components/AdminPanel"

// Aperture toolkit on phones; original orbital toolkit on laptops/desktops.
function useIsMobile() {
  const query = '(max-width: 767px)';
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

function App() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <>
      <CursorGlow />
      <Navbar />
      
      {/* Persist homepage in the background unless we are in the admin panel */}
      {location.pathname !== '/admin' && (
        <div className="w-full">
          <Hero />
          {isMobile ? <ApertureToolkit /> : <TechStack />}
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


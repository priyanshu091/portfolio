import { Routes, Route } from 'react-router-dom'
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
  return (
    <>
      <CursorGlow />
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <TechStack />
            <Work />
            <About />
            <Services />
            <Contact />
          </>
        } />
        <Route path="/work/:domainId" element={<DomainPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  )
}

export default App


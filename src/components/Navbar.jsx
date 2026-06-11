import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ParticleLogo from './ParticleLogo';

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const menuRef = useRef(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeLink, setActiveLink] = useState(null);

  const navLinks = ['WORK', 'ABOUT', 'SERVICES', 'CONTACT'];

  // ── Active section tracking via scroll position ──
  // getBoundingClientRect approach is the most reliable method:
  // walks every section on each scroll event and picks the last one
  // whose top edge has crossed 40% down the viewport.
  useEffect(() => {
    const sectionIds = ['work', 'about', 'services', 'contact'];

    const determineActive = () => {
      const scrollY = window.scrollY;

      // Back at the very top — no section highlighted
      if (scrollY < 80) {
        setActiveLink(null);
        return;
      }

      // Threshold: 40% down from the top of the viewport feels natural.
      // We use a fixed pixel offset (navbarHeight + a bit) for consistency.
      const THRESHOLD = 130;

      // Iterate sections in order; the LAST one whose top is above THRESHOLD wins.
      // This means whichever section is currently occupying the top of the screen
      // stays active for as long as you're inside it.
      let found = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= THRESHOLD) {
          found = id.toUpperCase();
        }
      }

      setActiveLink(found);
    };

    // Run immediately in case the page loaded with a hash anchor
    determineActive();

    window.addEventListener('scroll', determineActive, { passive: true });
    return () => window.removeEventListener('scroll', determineActive);
  }, []);

  // ── Entrance animation ──
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'expo.out' }
    )
    .fromTo(linksRef.current,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' },
      '-=0.8'
    )
    .fromTo(menuRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
      '-=0.8'
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full h-[90px] z-[100] flex items-center justify-between px-8 md:px-16 bg-transparent pointer-events-none"
    >
      <style>{`
        @keyframes navActivePulse {
          0%, 100% { box-shadow: 0 0 6px rgba(255,45,85,0.5); opacity: 0.8; }
          50% { box-shadow: 0 0 16px rgba(255,45,85,1); opacity: 1; }
        }
        @keyframes navActiveDot {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
      `}</style>

      {/* LEFT: Kinetic Particle Logo */}
      <div ref={logoRef} className="pointer-events-auto">
        <ParticleLogo />
      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10 flex items-center pointer-events-auto">

        {/* Glassmorphic Nav Panel */}
        <div
          className="hidden md:flex items-center p-1 rounded-full border backdrop-blur-md gap-3 mr-12"
          style={{
            backgroundColor: 'rgba(13, 13, 13, 0.4)',
            borderColor: 'var(--border-subtle)',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {navLinks.map((link, index) => {
            const isHovered = hoveredLink === link;
            const isActive = activeLink === link;

            let borderColor = 'var(--border-subtle)';
            let bgColor = 'rgba(20, 20, 20, 0.3)';
            let textColor = 'var(--text-secondary)';
            let pillTransform = 'translateY(0) translateZ(0) scale(1)';
            let shadow = 'none';
            let textShadow = 'none';

            if (isHovered) {
              borderColor = 'var(--scarlet-primary)';
              bgColor = 'rgba(31, 31, 31, 0.6)';
              textColor = 'var(--text-primary)';
              pillTransform = 'translateY(-4px) translateZ(12px) scale(1.05)';
              shadow = '0 8px 25px rgba(255, 45, 85, 0.25), inset 0 0 8px rgba(255, 45, 85, 0.15)';
              textShadow = '0 0 6px var(--scarlet-glow)';
            } else if (isActive) {
              borderColor = 'rgba(255, 45, 85, 0.55)';
              bgColor = 'rgba(255, 45, 85, 0.08)';
              textColor = '#ffffff';
              pillTransform = 'translateY(0) translateZ(0) scale(1)';
              shadow = '0 0 20px rgba(255,45,85,0.15), inset 0 0 12px rgba(255,45,85,0.07)';
              textShadow = '0 0 8px rgba(255, 45, 85, 0.55)';
            }

            return (
              <a
                key={link}
                ref={el => linksRef.current[index] = el}
                href={`#${link.toLowerCase()}`}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border backdrop-blur-md"
                style={{
                  color: textColor,
                  backgroundColor: bgColor,
                  borderColor,
                  transform: pillTransform,
                  boxShadow: shadow,
                  textShadow,
                  display: 'inline-block',
                  transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Active bottom bar */}
                {isActive && (
                  <span
                    className="absolute bottom-[4px] left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      width: '20px',
                      height: '2px',
                      backgroundColor: 'var(--scarlet-primary)',
                      animation: 'navActivePulse 2s ease-in-out infinite',
                    }}
                  />
                )}

                {/* Active corner dot */}
                {isActive && (
                  <span
                    className="absolute top-[5px] right-[6px] w-1 h-1 rounded-full pointer-events-none"
                    style={{
                      backgroundColor: 'var(--scarlet-primary)',
                      animation: 'navActiveDot 2s ease-in-out infinite',
                    }}
                  />
                )}

                {link}
              </a>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          ref={menuRef}
          className="group flex flex-col justify-center items-end space-y-[6px] w-8 h-8 cursor-pointer"
          aria-label="Menu"
        >
          <span
            className="block w-8 h-[1px] transition-all duration-400 ease-out group-hover:w-5"
            style={{ backgroundColor: 'var(--scarlet-primary)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--text-primary)'}
          />
          <span
            className="block w-8 h-[1px] transition-all duration-400 ease-out"
            style={{ backgroundColor: 'var(--scarlet-primary)' }}
          />
          <span
            className="block w-5 h-[1px] transition-all duration-400 ease-out group-hover:w-8"
            style={{ backgroundColor: 'var(--scarlet-primary)' }}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

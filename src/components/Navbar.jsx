import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const menuRef = useRef(null);

  const navLinks = ['WORK', 'ABOUT', 'SERVICES', 'CONTACT'];

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Logo fade from left
    tl.fromTo(logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'expo.out' }
    )
    // Links slide down
    .fromTo(linksRef.current,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' },
      '-=0.8'
    )
    // Hamburger fade from right
    .fromTo(menuRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
      '-=0.8'
    );
  }, []);

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 w-full h-[80px] z-[100] flex items-center justify-between px-8 md:px-16 bg-transparent"
    >
      {/* LEFT: Logo */}
      <div 
        ref={logoRef}
        className="relative z-10 text-[#ff2a2a] font-bold text-[18px] tracking-[0.18em] cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
        style={{ fontFamily: '"Inter", "Outfit", sans-serif' }}
      >
        LEMA&deg;
      </div>

      {/* RIGHT SIDE (Links + Hamburger) */}
      <div className="relative z-10 flex items-center">
        
        {/* CENTER/RIGHT: Navigation Links */}
        <div className="hidden md:flex items-center space-x-12 mr-16">
          {navLinks.map((link, index) => (
            <a
              key={link}
              ref={el => linksRef.current[index] = el}
              href={`#${link.toLowerCase()}`}
              className="relative text-white text-[12px] uppercase tracking-[2px] transition-colors duration-300 ease-in-out hover:text-[#ff2a2a] group"
            >
              {link}
            </a>
          ))}
        </div>

        {/* RIGHT: Hamburger Menu */}
        <button 
          ref={menuRef}
          className="group flex flex-col justify-center items-end space-y-[6px] w-8 h-8 cursor-pointer"
          aria-label="Menu"
        >
          {/* Animated Hamburger Lines */}
          <span className="block w-8 h-[1px] bg-[#ff2a2a] transition-all duration-400 ease-out group-hover:w-5 group-hover:bg-white" />
          <span className="block w-8 h-[1px] bg-[#ff2a2a] transition-all duration-400 ease-out group-hover:bg-white" />
          <span className="block w-5 h-[1px] bg-[#ff2a2a] transition-all duration-400 ease-out group-hover:w-8 group-hover:bg-white" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

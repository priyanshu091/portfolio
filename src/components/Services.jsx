import React, { useState, useRef, useEffect } from 'react';

const services = [
  {
    id: 'documentary',
    code: '01',
    title: 'DOCUMENTARY & FACT',
    tag: 'DEEP DIVE',
    color: '#FF2D55',
    desc: 'Long-form investigative storytelling with cinematic pacing, multi-source assembly, and impact-driven narrative arcs.',
    deliverables: ['Color Grading', 'Multi-cam Edit', 'Motion Titles', 'Sound Design'],
    turnaround: '5–7 DAYS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
  },
  {
    id: 'reels',
    code: '02',
    title: 'PODCAST REELS',
    tag: 'SHORT FORM',
    color: '#00D9FF',
    desc: 'Hook-first editing for short-form content. Auto-captions, dynamic cuts, B-roll layering, and trend-aligned pacing.',
    deliverables: ['Auto-Captions', 'B-Roll Layer', 'Hook Editing', 'Aspect Resize'],
    turnaround: '24–48 HRS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
      </svg>
    ),
  },
  {
    id: 'commercial',
    code: '03',
    title: 'COMMERCIAL & BRAND',
    tag: 'ADVERTISING',
    color: '#FFFFFF',
    desc: 'High-impact brand films and product showcases. Precise pacing, motion graphics overlays, and premium grade color.',
    deliverables: ['Brand Color Grade', 'Motion Graphics', 'VO Sync', 'Multi-format'],
    turnaround: '3–5 DAYS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    id: 'beat',
    code: '04',
    title: 'BEAT SYNC & TRAVEL',
    tag: 'DYNAMIC',
    color: '#FF5470',
    desc: 'Music-driven edits with frame-perfect beat drops, kinetic transitions, and atmospheric drone + GoPro sequencing.',
    deliverables: ['Beat Mapping', 'Kinetic Cuts', 'Drone Seq.', 'Color Mood'],
    turnaround: '48–72 HRS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    id: 'long-form',
    code: '05',
    title: 'LONG FORMAT PODCAST',
    tag: 'RETENTION',
    color: '#00FF9D',
    desc: 'Audience-retention editing for 30–180 min podcasts. Chapter markers, dynamic zoom, animated waveforms, and clean audio cuts.',
    deliverables: ['Chapter Marks', 'Zoom Dynamics', 'Waveform Anim.', 'Noise Remove'],
    turnaround: '3–5 DAYS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    id: 'wedding',
    code: '06',
    title: 'WEDDING & EVENT',
    tag: 'CINEMATIC',
    color: '#D998FF',
    desc: 'Emotional storytelling for milestone moments. Cinematic LUTs, aerial B-roll integration, and highlight reel engineering.',
    deliverables: ['Cinematic LUT', 'Highlight Reel', 'Aerial B-roll', 'Music Sync'],
    turnaround: '5–7 DAYS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'graphics',
    code: '07',
    title: 'GRAPHIC DESIGNING',
    tag: 'CREATIVE',
    color: '#FFCC00',
    desc: "Thumbnails, key art, overlay templates, and custom branding designed to capture attention and elevate your content's visual identity.",
    deliverables: ['YouTube Thumbnails', 'Key Art / Posters', 'Social Media Kits', 'Branding Kits'],
    turnaround: '24–48 HRS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'motion',
    code: '08',
    title: 'MOTION GRAPHICS',
    tag: 'ANIMATION',
    color: '#D998FF',
    desc: 'Kinetic typography, custom transitions, logo reveals, and advanced 2D/3D motion assets engineered to elevate your visual identity.',
    deliverables: ['Kinetic Typography', 'Logo Animation', 'Custom Intros', 'Overlay Templates'],
    turnaround: '48–72 HRS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const [isGlowing, setIsGlowing] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  // Callback ref for Intersection Observer (robust React way, avoids timing bugs)
  const cardRefCallback = (el) => {
    if (!el) return;
    
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = parseInt(entry.target.dataset.idx);
              setVisibleCards(prev => prev.includes(idx) ? prev : [...prev, idx]);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
      );
    }
    observerRef.current.observe(el);
  };

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Listen for the bookServices event to trigger double border glow
  useEffect(() => {
    const handleBookServices = () => {
      // Clear visible cards first so they don't animate randomly during scroll
      setVisibleCards([]);
      
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // After scroll settles, reveal all cards in perfect ascending order with the glow sequence
      setTimeout(() => {
        setVisibleCards([0, 1, 2, 3, 4, 5, 6, 7]);
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 3300); // 3.3s fits (7 * 0.3s + 0.9s = 3.0s) with buffer
      }, 600);
    };

    window.addEventListener('bookServices', handleBookServices);
    return () => window.removeEventListener('bookServices', handleBookServices);
  }, []);

  const hovered = services.find(s => s.id === hoveredCard);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full min-h-fit overflow-hidden py-12 md:py-16 scroll-mt-24"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      <style>{`
        @keyframes svcScan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(5000%); opacity: 0; }
        }
        @keyframes svcAurora1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px,-40px) scale(1.12); }
        }
        @keyframes svcAurora2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,60px) scale(0.9); }
        }
        @keyframes svcPulse {
          0%,100% { opacity:0.4; transform:scale(1); }
          50% { opacity:1; transform:scale(1.6); }
        }
        @keyframes svcGridFade {
          0%,100% { opacity:0.035; }
          50% { opacity:0.065; }
        }
        @keyframes svcCardReveal {
          from { opacity:0; transform:translateY(36px) scale(0.97); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes svcTagBlink {
          0%,100% { opacity:1; }
          50% { opacity:0.4; }
        }
        @keyframes svcSweep {
          from { left: -80px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { left: calc(100% + 80px); opacity: 0; }
        }
        @keyframes svcCardRevealWithGlow {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
            border-color: rgba(255,255,255,0.06);
            box-shadow: none;
            background: rgba(13,13,13,0.5);
          }
          /* 35%: Fully slide in, start breathing glow */
          35% {
            opacity: 1;
            transform: translateY(0) scale(1);
            border-color: rgba(255,255,255,0.06);
            box-shadow: none;
            background: rgba(13,13,13,0.5);
          }
          /* 65%: Soft peak ambient breathing glow */
          65% {
            border-color: var(--svc-color) !important;
            box-shadow: var(--svc-glow-shadow) !important;
            background: var(--svc-glow-bg) !important;
          }
          /* 100%: Smooth fade out back to base state */
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            border-color: rgba(255,255,255,0.06);
            box-shadow: none;
            background: rgba(13,13,13,0.5);
          }
        }
        .svc-card {
          opacity: 0;
          transform: translateY(36px) scale(0.97);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
          transition-delay: var(--reveal-delay, 0s);
        }
        .svc-card.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .svc-card:hover {
          transition-delay: 0s !important;
        }
        .svc-card:hover .svc-icon { transform: scale(1.15) rotate(-5deg); }
        .svc-card:hover .svc-arrow { transform: translate(4px,-4px); opacity:1; }
        .svc-card:hover .svc-sweep { animation: svcSweep 1.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .svc-card:hover .svc-deliverable { border-color: rgba(255,255,255,0.12) !important; background: rgba(255,255,255,0.04) !important; }
        .svc-icon { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .svc-arrow { transition: transform 0.4s ease, opacity 0.3s ease; opacity:0.4; }
      `}</style>

      {/* Background grid */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'svcGridFade 7s ease-in-out infinite',
        }}
      />

      {/* Aurora blobs */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.06) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'svcAurora1 16s ease-in-out infinite' }}
      />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.05) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'svcAurora2 20s ease-in-out infinite' }}
      />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.25) 50%,transparent)', animation: 'svcScan 9s ease-in-out infinite 2s' }}
        />
      </div>

      <div className="w-full px-8 md:px-16 relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--scarlet-primary)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'svcPulse 2s ease-in-out infinite' }} />
            <span className="text-[11px] uppercase tracking-[3px] font-bold">SERVICES OFFERED</span>
            <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg,var(--scarlet-primary),transparent)' }} />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                WHAT WE<br />
                <span style={{ color: 'var(--scarlet-primary)' }}>DELIVER</span>
              </h2>
            </div>

            {/* Live status HUD */}
            <div className="flex flex-col items-start md:items-end gap-2 mb-0">
              <div
                className="px-4 py-2 flex items-center gap-2"
                style={{ border: '1px solid rgba(0,217,255,0.2)', backgroundColor: 'rgba(0,217,255,0.04)', backdropFilter: 'blur(8px)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--cyan-primary)', boxShadow: '0 0 6px var(--cyan-primary)', animation: 'svcPulse 2s ease-in-out infinite' }} />
                <span className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--cyan-primary)' }}>{services.length} ACTIVE SERVICES</span>
              </div>
              <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>CLICK CARD TO ENQUIRE</span>
            </div>
          </div>
        </div>

        {/* ── Service Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {services.map((svc, i) => {
            const isHov = hoveredCard === svc.id;
            const isVis = visibleCards.includes(i);
            return (
              <div
                key={svc.id}
                ref={cardRefCallback}
                data-idx={i}
                className={`svc-card relative p-5 cursor-pointer overflow-hidden ${isVis ? 'revealed' : ''}`}
                style={{
                  '--svc-color': svc.color,
                  '--svc-glow-shadow': `0 0 35px ${svc.color}50, inset 0 0 25px ${svc.color}15`,
                  '--svc-glow-bg': `${svc.color}10`,
                  '--reveal-delay': isVis ? `${i * 0.08}s` : '0s',
                  border: `1px solid ${isHov ? `${svc.color}55` : 'rgba(255,255,255,0.06)'}`,
                  backgroundColor: isHov ? `${svc.color}08` : 'rgba(13,13,13,0.5)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: isHov ? `0 0 30px ${svc.color}20, inset 0 0 20px ${svc.color}06` : 'none',
                  transform: isHov ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                  animation: isGlowing 
                    ? `svcCardRevealWithGlow 0.9s ease-in-out both` 
                    : 'none',
                  animationDelay: isGlowing ? `${i * 0.3}s` : '0s',
                }}
                onMouseEnter={() => setHoveredCard(svc.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  localStorage.setItem('selectedService', svc.id);
                  window.dispatchEvent(new CustomEvent('serviceSelected'));
                }}
              >
                {/* Corner brackets */}
                <span className="absolute top-2 left-2 w-3 h-3 border-t border-l pointer-events-none transition-all duration-400"
                  style={{ borderColor: (isHov || isGlowing) ? svc.color : 'rgba(255,255,255,0.1)' }} />
                <span className="absolute top-2 right-2 w-3 h-3 border-t border-r pointer-events-none transition-all duration-400"
                  style={{ borderColor: (isHov || isGlowing) ? svc.color : 'rgba(255,255,255,0.1)' }} />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l pointer-events-none transition-all duration-400"
                  style={{ borderColor: (isHov || isGlowing) ? svc.color : 'rgba(255,255,255,0.1)' }} />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r pointer-events-none transition-all duration-400"
                  style={{ borderColor: (isHov || isGlowing) ? svc.color : 'rgba(255,255,255,0.1)' }} />

                {/* Sweep glow on hover */}
                <div className="svc-sweep absolute top-0 bottom-0 w-[80px] mix-blend-screen pointer-events-none"
                  style={{
                    left: '-80px',
                    background: `linear-gradient(90deg, transparent, ${svc.color}40, transparent)`,
                    filter: 'blur(10px)',
                  }}
                />

                {/* Inner scan line on card */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-0 right-0 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg,transparent,${svc.color}30 50%,transparent)`,
                      animation: isHov ? 'svcScan 3s ease-in-out infinite' : 'none',
                    }}
                  />
                </div>

                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-2">
                    {/* Code */}
                    <span className="text-[9px] font-bold uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SVC_{svc.code}</span>
                    {/* Tag pill */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-1" style={{ border: `1px solid ${svc.color}40`, backgroundColor: `${svc.color}0D` }}>
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: svc.color, animation: 'svcTagBlink 2s ease-in-out infinite' }} />
                      <span className="text-[8px] font-black uppercase tracking-[1.5px]" style={{ color: svc.color }}>{svc.tag}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="svc-icon" style={{ color: isHov ? svc.color : 'var(--text-muted)' }}>
                      {svc.icon}
                    </div>
                    {/* Arrow */}
                    <div className="svc-arrow text-[20px]" style={{ color: svc.color }}>↗</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white text-[17px] font-black uppercase tracking-wide leading-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-[12px] leading-[1.7] mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {svc.desc}
                </p>

                {/* Deliverables */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {svc.deliverables.map(d => (
                    <span
                      key={d}
                      className="svc-deliverable px-2 py-1 text-[9px] font-bold uppercase tracking-[1px] transition-all duration-300"
                      style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Footer: turnaround */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TURNAROUND</span>
                  <span className="text-[10px] font-black uppercase tracking-[1px]" style={{ color: isHov ? svc.color : 'var(--text-secondary)' }}>{svc.turnaround}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA Strip ── */}
        <div
          className="relative mt-10 p-6 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(13,13,13,0.5)', backdropFilter: 'blur(20px)' }}
        >
          {/* Corner brackets */}
          <span className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
          <span className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />

          <div>
            <div className="text-[9px] uppercase tracking-[2px] mb-2 font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CUSTOM PROJECT</div>
            <p className="text-white font-bold text-lg uppercase tracking-wide">Need something not listed?</p>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Every great project starts with a conversation.</p>
          </div>

          <a
            href="#contact"
            className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(255,45,85,0.4)', backgroundColor: 'rgba(255,45,85,0.06)', backdropFilter: 'blur(12px)', transition: 'all 0.4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.8)'; e.currentTarget.style.backgroundColor = 'rgba(255,45,85,0.14)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,45,85,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,45,85,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--scarlet-primary)', boxShadow: '0 0 6px var(--scarlet-primary)', animation: 'svcPulse 2s ease-in-out infinite' }} />
            <span className="text-[11px] font-bold uppercase tracking-[3px] text-white">START A PROJECT</span>
            <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--scarlet-primary)' }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;

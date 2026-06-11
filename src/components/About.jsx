import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Animated counter hook ──
function useCounter(end, duration = 1800, startTrigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [startTrigger, end, duration]);
  return count;
}

const milestones = [
  { year: '2020', label: 'STARTED JOURNEY', desc: 'First cinematic edit on After Effects — hooked instantly.' },
  { year: '2021', label: 'FIRST CLIENT', desc: 'Landed first paid brand project. Delivered 3-day turnaround.' },
  { year: '2022', label: '50+ PROJECTS', desc: 'Expanded into documentary & podcast long-form content.' },
  { year: '2023', label: '5M+ VIEWS', desc: 'Client reels crossed 5 million organic views combined.' },
  { year: '2024', label: '10M+ VIEWS', desc: 'Scale-up: 150+ projects, 48HR delivery standard established.' },
];

const traits = [
  { icon: '🎬', label: 'Cinematic Vision', desc: 'Every frame is a deliberate creative choice.' },
  { icon: '⚡', label: '48HR Turnaround', desc: 'Speed without compromising quality — always.' },
  { icon: '🔊', label: 'Audio-First Edit', desc: 'Sound design and pacing drive the emotion.' },
  { icon: '📈', label: 'Retention Focus', desc: 'Editing engineered to keep audiences watching.' },
];

const About = () => {
  const [activeYear, setActiveYear] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);

  const projects = useCounter(150, 1600, triggered);
  const views = useCounter(10, 1400, triggered);
  const clients = useCounter(60, 1200, triggered);

  useEffect(() => {
    const headingText = "I DON'T JUST MAKE CLIPS I BUILD ENGAGEMENT";
    const subText = "DIVYANSH VISHWAKARMA // CREATIVE VIDEO EDITOR";
    const p1Text = "I turn raw footage into polished, professional videos that connect with viewers. My focus is on clean cuts, great rhythm, and a visual style that matches your voice. No matter the platform, I make sure your videos are easy to watch, professional, and engaging.";
    const p2Text = "Based in India, helping brands and creators stand out worldwide. My standard turnaround time is 48 hours.";

    const getHeadingHTML = (currentLen) => {
      const p1 = "I DON'T JUST";
      const p2 = "MAKE CLIPS";
      const p3 = "I BUILD";
      const p4 = "ENGAGEMENT";
      
      const segments = [
        { text: p1, style: "" },
        { text: p2, style: "color: var(--scarlet-primary)" },
        { text: p3, style: "" },
        { text: p4, style: "" }
      ];
      
      let currentPos = 0;
      let htmlSegments = [];
      let cursorPlaced = false;
      
      const totalLen = segments.reduce((sum, s) => sum + s.text.length, 0);
      const roundedLen = Math.ceil(currentLen);
      
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const start = currentPos;
        const end = currentPos + seg.text.length;
        
        let segHTML = "";
        if (roundedLen <= start) {
          segHTML = `<span style="opacity: 0; ${seg.style}">${seg.text}</span>`;
        } else if (roundedLen >= end) {
          segHTML = `<span style="${seg.style}">${seg.text}</span>`;
        } else {
          const visibleCount = roundedLen - start;
          const visibleText = seg.text.slice(0, visibleCount);
          const invisibleText = seg.text.slice(visibleCount);
          segHTML = `<span style="${seg.style}">${visibleText}</span><span style="opacity: 0.6">_</span><span style="opacity: 0; ${seg.style}">${invisibleText}</span>`;
          cursorPlaced = true;
        }
        htmlSegments.push(segHTML);
        currentPos = end;
      }
      
      if (!cursorPlaced) {
        if (roundedLen === 0) {
          htmlSegments[0] = `<span style="opacity: 0.6">_</span>` + htmlSegments[0];
        }
      }
      
      return htmlSegments.join("<br/>");
    };

    // Immediately set initial state to prevent flash of empty/incorrect text
    if (headingRef.current) {
      headingRef.current.innerHTML = getHeadingHTML(0);
    }
    if (subRef.current) {
      subRef.current.innerHTML = `<span style="opacity: 0">${subText}</span>`;
    }
    if (p1Ref.current) {
      p1Ref.current.innerHTML = `<span style="opacity: 0">${p1Text}</span>`;
    }
    if (p2Ref.current) {
      p2Ref.current.innerHTML = `<span style="opacity: 0">${p2Text}</span>`;
    }

    gsap.set('.about-trait-card', { opacity: 0, y: 24 });

    const textObj = { headingLen: 0, subLen: 0, p1Len: 0, p2Len: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=800',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onEnter: () => {
          setTriggered(true);
        }
      }
    });

    tl.to(textObj, {
      headingLen: 39, // sum of length of segments (12+10+7+10)
      duration: 1.5,
      ease: 'none',
      onUpdate: () => {
        if (headingRef.current) {
          headingRef.current.innerHTML = getHeadingHTML(textObj.headingLen);
        }
      }
    })
    .to(textObj, {
      subLen: subText.length,
      duration: 1.0,
      ease: 'none',
      onUpdate: () => {
        if (subRef.current) {
          const currentLen = Math.ceil(textObj.subLen);
          const visibleSub = subText.slice(0, currentLen);
          const invisibleSub = subText.slice(currentLen);
          const cursor = currentLen < subText.length ? '<span style="opacity: 0.6">_</span>' : '';
          subRef.current.innerHTML = `${visibleSub}<span style="opacity: 0">${invisibleSub}</span>${cursor}`;
        }
      }
    })
    .to(textObj, {
      p1Len: p1Text.length,
      duration: 2.5,
      ease: 'none',
      onUpdate: () => {
        if (p1Ref.current) {
          const currentLen = Math.ceil(textObj.p1Len);
          const visibleP1 = p1Text.slice(0, currentLen);
          const invisibleP1 = p1Text.slice(currentLen);
          const cursor = currentLen < p1Text.length ? '<span style="opacity: 0.6">_</span>' : '';
          p1Ref.current.innerHTML = `${visibleP1}<span style="opacity: 0">${invisibleP1}</span>${cursor}`;
        }
      }
    })
    .to(textObj, {
      p2Len: p2Text.length,
      duration: 1.5,
      ease: 'none',
      onUpdate: () => {
        if (p2Ref.current) {
          const currentLen = Math.ceil(textObj.p2Len);
          const visibleP2 = p2Text.slice(0, currentLen);
          const invisibleP2 = p2Text.slice(currentLen);
          const cursor = currentLen < p2Text.length ? '<span style="opacity: 0.6">_</span>' : '';
          p2Ref.current.innerHTML = `${visibleP2}<span style="opacity: 0">${invisibleP2}</span>${cursor}`;
        }
      }
    })
    .to('.about-trait-card', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out'
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center py-32"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      <style>{`
        @keyframes aboutScan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(4000%); opacity: 0; }
        }
        @keyframes aboutAurora1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(50px,-40px) scale(1.12); }
        }
        @keyframes aboutAurora2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px,50px) scale(0.9); }
        }
        @keyframes aboutPulse {
          0%,100% { opacity:0.4; transform:scale(1); }
          50% { opacity:1; transform:scale(1.6); }
        }
        @keyframes aboutGridFade {
          0%,100% { opacity:0.035; }
          50% { opacity:0.07; }
        }
        @keyframes aboutBarFill {
          from { width: 0%; }
          to { width: var(--target-w); }
        }
        @keyframes traitCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .about-trait-card {
          transition: border-color 0.35s ease, background-color 0.35s ease;
        }
        .about-trait-card:hover {
          border-color: rgba(255,45,85,0.4) !important;
          background: rgba(255,45,85,0.04) !important;
          transform: translateY(-4px) scale(1.02) !important;
          transition: border-color 0.35s ease, background 0.35s ease, transform 0.35s ease !important;
        }
        .about-timeline-card {
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          backdrop-filter: blur(0px);
          transition:
            background 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            backdrop-filter 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-timeline-card:hover {
          background: rgba(0, 217, 255, 0.04);
          border-color: rgba(0, 217, 255, 0.18);
          backdrop-filter: blur(14px);
          box-shadow: 0 0 24px rgba(0, 217, 255, 0.06), inset 0 0 20px rgba(0, 217, 255, 0.03);
          transform: translateX(4px);
        }
        .about-timeline-card:hover .card-label {
          color: #ffffff !important;
          letter-spacing: 3px;
        }
        .about-timeline-card:hover .card-year {
          color: var(--cyan-primary) !important;
        }
        .card-label {
          transition: color 0.4s ease, letter-spacing 0.4s ease;
        }
        .card-year {
          transition: color 0.4s ease;
        }
        .about-stats-card {
          transition:
            border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            background-color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-stats-card:hover {
          border-color: rgba(0, 217, 255, 0.22) !important;
          background-color: rgba(0, 217, 255, 0.05) !important;
          box-shadow: 0 0 32px rgba(0, 217, 255, 0.08), inset 0 0 24px rgba(0, 217, 255, 0.04);
          transform: translateY(-3px);
        }
        @keyframes runwayGlow {
          0% {
            border-color: rgba(255, 255, 255, 0.12);
            background-color: rgba(13, 13, 13, 0.8);
            box-shadow: none;
            color: var(--text-muted);
          }
          10% {
            border-color: var(--cyan-primary);
            background-color: rgba(0, 217, 255, 0.12);
            box-shadow: 0 0 18px rgba(0, 217, 255, 0.4);
            color: var(--cyan-primary);
          }
          20%, 100% {
            border-color: rgba(255, 255, 255, 0.12);
            background-color: rgba(13, 13, 13, 0.8);
            box-shadow: none;
            color: var(--text-muted);
          }
        }
        .about-runway-dot {
          animation: runwayGlow 10s ease-in-out infinite;
          transition: none !important;
        }
        .about-runway-dot span {
          transition: none !important;
        }
        .about-runway-dot-0 {
          animation-delay: -10s;
        }
        .about-runway-dot-1 {
          animation-delay: -8s;
        }
        .about-runway-dot-2 {
          animation-delay: -6s;
        }
        .about-runway-dot-3 {
          animation-delay: -4s;
        }
        .about-runway-dot-4 {
          animation-delay: -2s;
        }
      `}</style>

      {/* Background grid */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'aboutGridFade 7s ease-in-out infinite',
        }}
      />

      {/* Aurora blobs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.07) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'aboutAurora1 14s ease-in-out infinite' }}
      />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aboutAurora2 18s ease-in-out infinite' }}
      />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.25) 50%, transparent)', animation: 'aboutScan 7s ease-in-out infinite' }}
        />
      </div>

      <div className="container mx-auto px-8 md:px-16 relative z-10 w-full">

        {/* ── Section label ── */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--cyan-primary)', animation: 'aboutPulse 2s ease-in-out infinite' }} />
          <span className="text-[11px] uppercase tracking-[3px] font-bold" style={{ color: 'var(--cyan-primary)' }}>ABOUT THE EDITOR</span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, var(--cyan-primary), transparent)' }} />
        </div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* LEFT — Headline + Bio + Traits */}
          <div>
            {/* Headline with glitch */}
            <h2
              ref={headingRef}
              className="text-white text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-8"
              style={{ fontFamily: '"Inter", sans-serif' }}
            />

            {/* HUD subtitle line */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8" style={{ backgroundColor: 'var(--scarlet-primary)' }} />
              <span ref={subRef} className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--scarlet-primary)', fontFamily: '"Courier New", monospace' }} />
            </div>

            <p ref={p1Ref} className="text-[16px] leading-[1.8] mb-4" style={{ color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }} />
            <p ref={p2Ref} className="text-[15px] leading-[1.8] mb-10" style={{ color: 'var(--text-muted)', fontFamily: '"Inter", sans-serif' }} />

            {/* Trait cards grid */}
            <div className="grid grid-cols-2 gap-3">
              {traits.map((t) => (
                <div
                  key={t.label}
                  className="about-trait-card p-4 cursor-default"
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(13,13,13,0.4)',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 0.35s ease, background 0.35s ease',
                  }}
                >
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-white mb-1">{t.label}</div>
                  <div className="text-[11px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Stats + Timeline */}
          <div className="flex flex-col gap-10">

            {/* Animated stat counters */}
            <div
              className="about-stats-card relative p-8 overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(13,13,13,0.5)', backdropFilter: 'blur(20px)' }}
            >
              {/* Corner brackets */}
              <span className="absolute top-2 left-2 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.4)' }} />
              <span className="absolute top-2 right-2 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.4)' }} />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.4)' }} />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.4)' }} />

              <div className="text-[9px] uppercase tracking-[2px] mb-6 font-bold" style={{ color: 'var(--text-muted)', fontFamily: '"Courier New", monospace' }}>// CAREER_METRICS</div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <div className="text-4xl font-black" style={{ color: 'var(--scarlet-primary)', fontFamily: '"Inter", sans-serif' }}>
                    {projects}<span className="text-2xl">+</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>PROJECTS</div>
                  <div className="mt-2 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(projects / 150) * 100}%`, backgroundColor: 'var(--scarlet-primary)', transition: 'width 0.1s ease' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-4xl font-black" style={{ color: 'var(--cyan-primary)', fontFamily: '"Inter", sans-serif' }}>
                    {views}<span className="text-2xl">M+</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>VIEWS GEN.</div>
                  <div className="mt-2 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(views / 10) * 100}%`, backgroundColor: 'var(--cyan-primary)', transition: 'width 0.1s ease' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-4xl font-black" style={{ color: '#00FF88', fontFamily: '"Inter", sans-serif' }}>
                    {clients}<span className="text-2xl">+</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>CLIENTS</div>
                  <div className="mt-2 h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(clients / 60) * 100}%`, backgroundColor: '#00FF88', transition: 'width 0.1s ease' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
                <span className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: '"Courier New", monospace' }}>SYS::CAREER_LOG</span>
                <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
              </div>

              <div className="relative flex flex-col gap-0">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[1px]" style={{ background: 'linear-gradient(to bottom, var(--scarlet-primary), var(--scarlet-deep))' }} />

                {milestones.map((m, i) => {
                  const isActive = activeYear === i;
                  return (
                    <div
                      key={m.year}
                      className="about-timeline-card relative flex items-start gap-5 p-3 pl-3 cursor-pointer"
                      onClick={() => setActiveYear(isActive ? null : i)}
                    >
                      {/* Dot */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 about-runway-dot about-runway-dot-${i}`}>
                        <span className="text-[10px] font-black">
                          {m.year.slice(2)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 pt-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="card-label text-[10px] font-black uppercase tracking-[2px] text-white">{m.label}</span>
                          <span className="card-year text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{m.year}</span>
                          {isActive && <span className="ml-auto text-[9px] uppercase tracking-[1px]" style={{ color: 'var(--scarlet-primary)' }}>EXPANDED</span>}
                        </div>
                        <div
                          className="text-[12px] leading-relaxed overflow-hidden transition-all duration-500"
                          style={{
                            color: 'var(--text-muted)',
                            maxHeight: isActive ? '80px' : '0px',
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          {m.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA pill */}
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 overflow-hidden self-start"
              style={{ border: '1px solid rgba(255,45,85,0.3)', backgroundColor: 'rgba(255,45,85,0.04)', backdropFilter: 'blur(12px)', transition: 'all 0.4s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.7)'; e.currentTarget.style.backgroundColor = 'rgba(255,45,85,0.1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,45,85,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,45,85,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(255,45,85,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--scarlet-primary)', boxShadow: '0 0 6px var(--scarlet-primary)', animation: 'aboutPulse 2s ease-in-out infinite' }} />
              <span className="text-[11px] font-bold uppercase tracking-[3px] text-white">LET'S COLLABORATE</span>
              <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--scarlet-primary)' }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

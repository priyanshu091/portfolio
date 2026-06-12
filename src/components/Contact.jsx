import React, { useState, useRef, useEffect } from 'react';

const Contact = () => {
  const [hoveredField, setHoveredField] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', project: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const formCardRef = useRef(null);

  // Pre-select service if navigated from a service card + scroll form into center + pulse highlight
  useEffect(() => {
    const handleServiceSelected = () => {
      const saved = localStorage.getItem('selectedService');
      if (!saved) return;
      setFormData(prev => ({ ...prev, project: saved }));
      localStorage.removeItem('selectedService');

      // Slight delay so layout settles, then scroll form card to vertical center
      setTimeout(() => {
        if (formCardRef.current) {
          formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Trigger glow pulse after scroll animation finishes (~800ms)
        setTimeout(() => {
          setIsHighlighted(true);
          // Remove class after 3 pulses (3 × 700ms = 2100ms + a little buffer)
          setTimeout(() => setIsHighlighted(false), 2300);
        }, 800);
      }, 150);
    };

    window.addEventListener('serviceSelected', handleServiceSelected);
    return () => window.removeEventListener('serviceSelected', handleServiceSelected);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate async send
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1800);
  };

  const fieldStyle = (name) => ({
    backgroundColor: hoveredField === name ? 'rgba(255,45,85,0.04)' : 'rgba(13,13,13,0.6)',
    border: `1px solid ${hoveredField === name ? 'rgba(255,45,85,0.5)' : 'rgba(255,255,255,0.08)'}`,
    backdropFilter: 'blur(12px)',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
    boxShadow: hoveredField === name ? '0 0 20px rgba(255,45,85,0.1), inset 0 0 12px rgba(255,45,85,0.04)' : 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
  });

  const infoItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: 'EMAIL',
      value: 'thedivyanshfx@gmail.com',
      href: 'mailto:thedivyanshfx@gmail.com',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
      label: 'INSTAGRAM',
      value: '@its_divyansh.x',
      href: 'https://www.instagram.com/its_divyansh.x/',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      label: 'LINKEDIN',
      value: 'Divyansh Vishwakarma',
      href: 'https://www.linkedin.com/in/divyansh-vishwakarma-9a84533a8/',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
        </svg>
      ),
      label: 'YOUTUBE',
      value: '@Divyansh_Uncovered',
      href: 'https://www.youtube.com/@Divyansh_Uncovered',
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full min-h-fit overflow-hidden flex items-center justify-center py-12 md:py-16 scroll-mt-24"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes contactScan {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(3000%); opacity: 0; }
        }
        @keyframes contactAurora1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-30px) scale(1.15); }
        }
        @keyframes contactAurora2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,40px) scale(0.9); }
        }
        @keyframes contactPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes contactBlink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes contactGridFade {
          0%,100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
        .contact-field:focus { 
          border-color: rgba(255,45,85,0.6) !important; 
          box-shadow: 0 0 25px rgba(255,45,85,0.12), inset 0 0 15px rgba(255,45,85,0.05) !important;
        }
        .contact-submit:hover .submit-liquid { transform: translateY(0%) !important; }
        .contact-submit:hover .submit-sweep { left: 120% !important; opacity: 1 !important; }
        .contact-submit:hover { border-color: rgba(255,45,85,0.7) !important; box-shadow: 0 0 30px rgba(255,45,85,0.25) !important; }
        .contact-info-card:hover { border-color: rgba(255,45,85,0.4) !important; background: rgba(255,45,85,0.04) !important; }
        .contact-info-card:hover .info-icon { color: var(--scarlet-primary) !important; }
        @keyframes formPulseGlow {
          0%   { border-color: rgba(255,255,255,0.07); box-shadow: none; background-color: rgba(13,13,13,0.5); }
          20%  { border-color: rgba(0,217,255,0.6);   box-shadow: 0 0 40px rgba(0,217,255,0.2), inset 0 0 30px rgba(0,217,255,0.07); background-color: rgba(0,217,255,0.06); }
          40%  { border-color: rgba(255,255,255,0.07); box-shadow: none; background-color: rgba(13,13,13,0.5); }
          60%  { border-color: rgba(0,217,255,0.6);   box-shadow: 0 0 40px rgba(0,217,255,0.2), inset 0 0 30px rgba(0,217,255,0.07); background-color: rgba(0,217,255,0.06); }
          80%  { border-color: rgba(255,255,255,0.07); box-shadow: none; background-color: rgba(13,13,13,0.5); }
          90%  { border-color: rgba(0,217,255,0.4);   box-shadow: 0 0 25px rgba(0,217,255,0.12), inset 0 0 20px rgba(0,217,255,0.04); background-color: rgba(0,217,255,0.03); }
          100% { border-color: rgba(255,255,255,0.07); box-shadow: none; background-color: rgba(13,13,13,0.5); }
        }
        .form-highlight {
          animation: formPulseGlow 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

      `}</style>

      {/* Background Grid (animated) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'contactGridFade 6s ease-in-out infinite',
        }}
      />

      {/* Aurora Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(255,45,85,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'contactAurora1 12s ease-in-out infinite',
        }}
      />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'contactAurora2 16s ease-in-out infinite',
        }}
      />

      {/* Vertical Scan Line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,45,85,0.3) 50%, transparent 100%)',
            animation: 'contactScan 5s ease-in-out infinite',
          }}
        />
      </div>

      <div className="container mx-auto px-8 md:px-16 relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--cyan-primary)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'contactPulse 2s ease-in-out infinite' }} />
            <span className="text-[11px] uppercase tracking-[3px] font-bold">INITIATE CONTACT</span>
            <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, var(--cyan-primary), transparent)' }} />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
              LET'S CREATE<br />
              <span style={{ color: 'var(--scarlet-primary)' }}>SOMETHING</span><br />
              REMARKABLE.
            </h2>
            {/* Live status HUD */}
            <div className="flex flex-col items-start md:items-end gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00FF88', boxShadow: '0 0 8px #00FF88', animation: 'contactBlink 1.4s ease-in-out infinite' }} />
                <span className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: '#00FF88' }}>AVAILABLE FOR PROJECTS</span>
              </div>
              <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>TURNAROUND: 48 HR</span>
              <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>TIMEZONE: IST UTC+5:30</span>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">

          {/* LEFT — Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-3">

            {/* HUD top bar */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
              <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONNECT</span>
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
            </div>

            {/* Contact info cards */}
            {infoItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-card group flex items-center gap-4 p-3 transition-all duration-400 cursor-pointer"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(13,13,13,0.4)',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.35s ease, background 0.35s ease',
                }}
              >
                <div className="info-icon w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors duration-300" style={{ color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{item.value}</span>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--scarlet-primary)' }}>↗</div>
              </a>
            ))}

            {/* Decorative HUD bottom panel */}
            <div className="mt-2 p-4 border border-dashed" style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(13,13,13,0.3)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RESPONSE_TIME</span>
                <span className="text-[9px] uppercase tracking-[2px]" style={{ color: '#00FF88', fontFamily: 'var(--font-mono)' }}>FAST</span>
              </div>
              <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: '85%', background: 'linear-gradient(90deg, var(--scarlet-primary), var(--cyan-primary))' }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>0HR</span>
                <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>48HR</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="lg:col-span-3 relative">
            {/* Form HUD top label */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
              <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEND A MESSAGE</span>
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
            </div>

            {/* Glassmorphic form card */}
            <div
              ref={formCardRef}
              className={`relative p-5 md:p-6 overflow-hidden ${isHighlighted ? 'form-highlight' : ''}`}
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                backgroundColor: 'rgba(13,13,13,0.5)',
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              {/* Inner scan line on card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute left-0 right-0 h-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.2) 50%, transparent 100%)',
                    animation: 'contactScan 8s ease-in-out infinite 3s',
                  }}
                />
              </div>

              {/* Corner brackets */}
              <span className="absolute top-2 left-2 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
              <span className="absolute top-2 right-2 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(255,45,85,0.3)' }} />

              {submitted ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(0,255,136,0.4)', backgroundColor: 'rgba(0,255,136,0.06)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xl font-bold tracking-widest uppercase mb-2">MESSAGE SENT</p>
                    <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>We'll get back to you within 48 hours.</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-[3px] font-bold" style={{ color: '#00FF88', fontFamily: 'var(--font-mono)' }}>MESSAGE DELIVERED</span>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>YOUR NAME</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setHoveredField('name')}
                        onBlur={() => setHoveredField(null)}
                        className="contact-field w-full px-4 py-2"
                        style={{ ...fieldStyle('name'), '::placeholder': { color: 'var(--text-muted)' } }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="hello@brand.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setHoveredField('email')}
                        onBlur={() => setHoveredField(null)}
                        className="contact-field w-full px-4 py-2"
                        style={fieldStyle('email')}
                      />
                    </div>
                  </div>

                  {/* Row 2: Project Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>PROJECT TYPE</label>
                    <select
                      name="project"
                      required
                      value={formData.project}
                      onChange={handleChange}
                      onFocus={() => setHoveredField('project')}
                      onBlur={() => setHoveredField(null)}
                      className="contact-field w-full px-4 py-2"
                      style={{ ...fieldStyle('project'), cursor: 'pointer' }}
                    >
                      <option value="" style={{ backgroundColor: '#0D0D0D' }}>— Select project type —</option>
                      <option value="documentary" style={{ backgroundColor: '#0D0D0D' }}>Documentary & Fact Style</option>
                      <option value="reels" style={{ backgroundColor: '#0D0D0D' }}>Podcast Reels / Short Form</option>
                      <option value="commercial" style={{ backgroundColor: '#0D0D0D' }}>Commercial & Brand</option>
                      <option value="beat" style={{ backgroundColor: '#0D0D0D' }}>Beat Sync & Travel</option>
                      <option value="long-form" style={{ backgroundColor: '#0D0D0D' }}>Long Format Podcast</option>
                      <option value="wedding" style={{ backgroundColor: '#0D0D0D' }}>Wedding & Event</option>
                      <option value="graphics" style={{ backgroundColor: '#0D0D0D' }}>Graphic Designing</option>
                      <option value="motion" style={{ backgroundColor: '#0D0D0D' }}>Motion Graphics</option>
                      <option value="other" style={{ backgroundColor: '#0D0D0D' }}>Other</option>
                    </select>
                  </div>

                  {/* Row 3: Message */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>MESSAGE</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Describe your project, timeline, and goals..."
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setHoveredField('message')}
                      onBlur={() => setHoveredField(null)}
                      className="contact-field w-full px-4 py-2 resize-none"
                      style={fieldStyle('message')}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="contact-submit relative inline-flex items-center justify-center px-10 py-3 overflow-hidden w-full mt-1 cursor-pointer"
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      backgroundColor: 'rgba(13,13,13,0.7)',
                      backdropFilter: 'blur(12px)',
                      transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                    }}
                  >
                    {/* Liquid fill */}
                    <div
                      className="submit-liquid absolute inset-0 pointer-events-none"
                      style={{ transform: 'translateY(100%)', transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)', backgroundColor: 'rgba(255,45,85,0.1)' }}
                    >
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,45,85,0.15) 0%, transparent 70%)' }} />
                    </div>
                    {/* Sweep orb */}
                    <div
                      className="submit-sweep absolute top-0 bottom-0 w-[80px] mix-blend-screen pointer-events-none"
                      style={{
                        left: '-80%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.45), transparent)',
                        filter: 'blur(10px)',
                        opacity: 0,
                        transition: 'left 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s',
                      }}
                    />

                    {/* Corner brackets */}
                    <span className="absolute top-1 left-1 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(255,45,85,0.4)' }} />
                    <span className="absolute top-1 right-1 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(255,45,85,0.4)' }} />
                    <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(255,45,85,0.4)' }} />
                    <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(255,45,85,0.4)' }} />

                    {/* Status dot */}
                    <span className="relative z-10 mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sending ? '#00FF88' : 'var(--scarlet-primary)', boxShadow: `0 0 6px ${sending ? '#00FF88' : 'var(--scarlet-primary)'}`, animation: 'contactBlink 1s ease-in-out infinite' }} />

                    <span className="relative z-10 text-[11px] font-bold uppercase tracking-[3px]" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-heading)' }}>
                      {sending ? 'SENDING...' : 'SEND MESSAGE'}
                    </span>

                    {!sending && (
                      <span className="relative z-10 ml-4 text-[16px]" style={{ color: 'var(--scarlet-primary)' }}>↗</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer Bar ── */}
        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--scarlet-primary)', boxShadow: '0 0 6px var(--scarlet-primary)' }} />
            <span className="text-[10px] uppercase tracking-[3px] font-bold" style={{ color: 'var(--text-muted)' }}>DIVYANSH VISHWAKARMA</span>
          </div>
          <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            © 2025 — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/its_divyansh.x/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s ease, filter 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.filter = 'drop-shadow(0 0 8px #E1306C88)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.filter = 'none'; }}
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Divyansh_Uncovered"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s ease, filter 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF0000'; e.currentTarget.style.filter = 'drop-shadow(0 0 8px #FF000088)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.filter = 'none'; }}
              title="YouTube"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/divyansh-vishwakarma-9a84533a8/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s ease, filter 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.filter = 'drop-shadow(0 0 8px #0A66C288)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.filter = 'none'; }}
              title="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Created By Credit Bar ── */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-[9px] uppercase tracking-[2px] text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <span>CREATED BY</span>
          <a 
            href="https://www.linkedin.com/in/priyanshu-vishwakarma-407695242/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 font-bold"
            style={{ 
              color: 'var(--cyan-primary)', 
              textShadow: '0 0 8px rgba(0, 217, 255, 0.5)'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.textShadow = '0 0 15px var(--cyan-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--cyan-primary)'; e.currentTarget.style.textShadow = '0 0 8px rgba(0, 217, 255, 0.5)'; }}
          >
            Priyanshu Vishwakarma
          </a>
          <span>&</span>
          <a 
            href="https://www.h4anshu.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 font-bold"
            style={{ 
              color: 'var(--cyan-primary)', 
              textShadow: '0 0 8px rgba(0, 217, 255, 0.5)'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.textShadow = '0 0 15px var(--cyan-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--cyan-primary)'; e.currentTarget.style.textShadow = '0 0 8px rgba(0, 217, 255, 0.5)'; }}
          >
            Anshu Mishra
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;

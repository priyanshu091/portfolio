import React, { useState, useRef, useEffect, useMemo } from 'react';

const platformOptions = [
  { id: 'youtube', label: 'YouTube', color: '#FF0000', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },

  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id: 'website', label: 'Website', color: '#00D9FF', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
];

const Contact = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', service: '', platforms: [],
    deadline: '', duration: '', budget: '', reference: '', details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const formCardRef = useRef(null);

  // Pre-select service if navigated from a service card + scroll form into center + pulse highlight
  useEffect(() => {
    const handleServiceSelected = () => {
      const saved = localStorage.getItem('selectedService');
      if (!saved) return;
      setFormData(prev => ({ ...prev, service: saved }));
      localStorage.removeItem('selectedService');

      setTimeout(() => {
        if (formCardRef.current) {
          formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => {
          setIsHighlighted(true);
          setTimeout(() => setIsHighlighted(false), 2300);
        }, 800);
      }, 150);
    };

    window.addEventListener('serviceSelected', handleServiceSelected);
    return () => window.removeEventListener('serviceSelected', handleServiceSelected);
  }, []);

  // --- Progress Calculation ---
  const totalFields = 9; // name, email, service, platforms(1+), deadline, duration, budget, reference, details
  const completedCount = useMemo(() => {
    let count = 0;
    if (formData.name.trim()) count++;
    if (formData.email.trim()) count++;
    if (formData.service) count++;
    if (formData.platforms.length > 0) count++;
    if (formData.deadline) count++;
    if (formData.duration) count++;
    if (formData.budget) count++;
    if (formData.reference.trim()) count++;
    if (formData.details.trim()) count++;
    return count;
  }, [formData]);
  const progressPercent = Math.round((completedCount / totalFields) * 100);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePlatform = (id) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter(p => p !== id)
        : [...prev.platforms, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    const serviceNames = {
      documentary: 'Documentary & Fact Style',
      reels: 'Podcast Reels / Short Form',
      commercial: 'Commercial & Brand',
      beat: 'Beat Sync & Travel',
      'long-form': 'Long Format Podcast',
      wedding: 'Wedding & Event',
      graphics: 'Graphic Designing',
      motion: 'Motion Graphics',
      other: 'Other',
    };

    const serviceName = serviceNames[formData.service] || formData.service || '';
    const platformNames = formData.platforms.map(p => platformOptions.find(o => o.id === p)?.label).join(', ');

    // --- Method 1: Google Form via GET (iframe src) ---
    const gFormParams = new URLSearchParams({
      'entry.1990602108': formData.name,
      'entry.1181205584': formData.email,
      'entry.581123435': formData.mobile || '',
      'entry.547102629': serviceName,
      'entry.857528850': platformNames,
      'entry.2039104366': formData.deadline || '',
      'entry.2046493657': formData.duration || '',
      'entry.1598111379': formData.budget || '',
      'entry.2004920983': formData.reference || '',
      'entry.1944229631': formData.details || '',
    });
    const gFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSc_n1V1wPLgwjrpIiK3Lf6E52Zp3p2KKfIIzF68OwA0gNsu-w/formResponse';
    const gIframe = document.createElement('iframe');
    gIframe.style.display = 'none';
    document.body.appendChild(gIframe);
    gIframe.src = gFormURL + '?' + gFormParams.toString();

    // --- Method 2: Apps Script via GET (iframe src) ---
    const scriptParams = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile || '',
      service: serviceName,
      platform: platformNames,
      deadline: formData.deadline || '',
      duration: formData.duration || '',
      budget: formData.budget || '',
      reference: formData.reference || '',
      details: formData.details || '',
    });
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzWy0-hezTXI0dDcW1TCWrZL9FFpLJxPNKq2_SgQ5JxfiQvZewDGZ49NoABZPEvaqXU/exec';
    const sIframe = document.createElement('iframe');
    sIframe.style.display = 'none';
    document.body.appendChild(sIframe);
    sIframe.src = scriptURL + '?' + scriptParams.toString();

    // Clean up after submission
    setTimeout(() => {
      try { document.body.removeChild(gIframe); } catch (_) {}
      try { document.body.removeChild(sIframe); } catch (_) {}
      setSending(false);
      setSubmitted(true);
    }, 3000);
  };

  // --- Field focus style (cyan theme) ---
  const fieldStyle = (name) => ({
    backgroundColor: focusedField === name ? 'rgba(0,217,255,0.04)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focusedField === name ? 'rgba(0,217,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
    backdropFilter: 'blur(12px)',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
    boxShadow: focusedField === name ? '0 0 20px rgba(0,217,255,0.08), inset 0 0 12px rgba(0,217,255,0.03)' : 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    borderRadius: '6px',
  });

  const labelStyle = (name) => ({
    color: focusedField === name ? 'var(--cyan-primary)' : 'var(--text-muted)',
    transition: 'color 0.3s ease',
  });

  // --- Brief summary entries ---
  const briefEntries = useMemo(() => {
    const entries = [];
    if (formData.name.trim()) entries.push({ label: 'Name', value: formData.name });
    if (formData.email.trim()) entries.push({ label: 'Email', value: formData.email });
    if (formData.mobile.trim()) entries.push({ label: 'Mobile', value: formData.mobile });
    if (formData.service) {
      const serviceNames = {
        documentary: 'Documentary & Fact Style', reels: 'Podcast Reels', commercial: 'Commercial & Brand',
        beat: 'Beat Sync & Travel', 'long-form': 'Long Format Podcast', wedding: 'Wedding & Event',
        graphics: 'Graphic Designing', motion: 'Motion Graphics', other: 'Other',
      };
      entries.push({ label: 'Service', value: serviceNames[formData.service] || formData.service });
    }
    if (formData.platforms.length > 0) {
      entries.push({ label: 'Platforms', value: formData.platforms.map(p => platformOptions.find(o => o.id === p)?.label).join(', ') });
    }
    if (formData.deadline) entries.push({ label: 'Deadline', value: formData.deadline });
    if (formData.duration) entries.push({ label: 'Duration', value: formData.duration });
    if (formData.budget) entries.push({ label: 'Budget', value: formData.budget });
    if (formData.reference.trim()) entries.push({ label: 'Reference', value: formData.reference });
    if (formData.details.trim()) entries.push({ label: 'Details', value: formData.details.length > 60 ? formData.details.slice(0, 60) + '...' : formData.details });
    return entries;
  }, [formData]);

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
      color: '#EA4335',
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
      color: '#E1306C',
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
      color: '#0A66C2',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      ),
      label: 'WHATSAPP',
      value: '+91 93690 97211',
      href: 'https://wa.me/919369097211',
      color: '#25D366',
    },
  ];

  // --- SVG Progress Ring ---
  const ringRadius = 16;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  return (
    <section
      id="contact"
      className="relative w-full min-h-fit overflow-hidden flex items-center justify-center py-6 md:py-8 scroll-mt-24"
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
        @keyframes shimmerSweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes briefRowEntry {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chipPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes progressRingPulse {
          0%,100% { filter: drop-shadow(0 0 2px rgba(0,217,255,0.3)); }
          50% { filter: drop-shadow(0 0 6px rgba(0,217,255,0.6)); }
        }
        .contact-field:focus {
          border-color: rgba(0, 217, 255, 0.5) !important;
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.1), inset 0 0 12px rgba(0, 217, 255, 0.04) !important;
          background-color: rgba(0, 217, 255, 0.03) !important;
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
        .platform-chip {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          user-select: none;
        }
        .platform-chip:hover {
          transform: translateY(-1px);
        }
        .platform-chip.selected {
          animation: chipPop 0.3s ease-out;
        }
        .brief-row {
          animation: briefRowEntry 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
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

      <div className="w-full px-8 md:px-16 relative z-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">

          {/* LEFT — Info Panel & Header */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            
            {/* ── Section Header ── */}
            <div className="mb-2">
              <div className="flex items-center gap-3 mb-3" style={{ color: 'var(--cyan-primary)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'contactPulse 2s ease-in-out infinite' }} />
                <span className="text-[11px] uppercase tracking-[3px] font-bold">INITIATE CONTACT</span>
                <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, var(--cyan-primary), transparent)' }} />
              </div>
              
              <h2 className="text-white text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
                LET'S CREATE<br />
                <span style={{ color: 'var(--scarlet-primary)' }}>SOMETHING</span><br />
                REMARKABLE.
              </h2>
              
              {/* Live status HUD */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00FF88', boxShadow: '0 0 8px #00FF88', animation: 'contactBlink 1.4s ease-in-out infinite' }} />
                  <span className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: '#00FF88' }}>AVAILABLE FOR PROJECTS</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>TURNAROUND: 48 HR</span>
                  <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>IST UTC+5:30</span>
                </div>
              </div>
            </div>

            {/* HUD top bar */}
            <div className="flex items-center gap-3 mb-1 mt-4">
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
                className="contact-info-card group flex items-center gap-3 p-2 transition-all duration-400 cursor-pointer"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(13,13,13,0.4)',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.35s ease, background 0.35s ease',
                }}
              >
                <div className="info-icon w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors duration-300" style={{ color: item.color, border: `1px solid ${item.color}40`, backgroundColor: `${item.color}15` }}>
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{item.value}</span>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--scarlet-primary)' }}>↗</div>
              </a>
            ))}

            {/* ── YOUR BRIEF SO FAR — Live Summary Panel ── */}
            <div className="mt-2 p-4 border border-dashed" style={{ borderColor: briefEntries.length > 0 ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(13,13,13,0.3)', transition: 'border-color 0.5s ease' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>YOUR BRIEF SO FAR</span>
                <span className="text-[9px] uppercase tracking-[2px]" style={{ color: briefEntries.length > 0 ? 'var(--cyan-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {briefEntries.length} / {totalFields}
                </span>
              </div>

              {briefEntries.length === 0 ? (
                <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>Start filling the form — your brief will appear here.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {briefEntries.map((entry, i) => (
                    <div key={entry.label} className="brief-row flex items-start gap-2" style={{ animationDelay: `${i * 0.05}s` }}>
                      <span className="text-[9px] uppercase tracking-[1.5px] font-bold flex-shrink-0 mt-[2px]" style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)', minWidth: '70px' }}>{entry.label}</span>
                      <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Project Brief Form */}
          <div className="lg:col-span-3 relative">
            {/* Form HUD top label */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
              <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>START A PROJECT</span>
              <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
            </div>

            {/* Glassmorphic form card */}
            <div
              ref={formCardRef}
              className={`relative p-4 md:p-5 overflow-hidden ${isHighlighted ? 'form-highlight' : ''}`}
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                backgroundColor: 'rgba(13,13,13,0.5)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
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
              <span className="absolute top-2 left-2 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.25)' }} />
              <span className="absolute top-2 right-2 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.25)' }} />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.25)' }} />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(0,217,255,0.25)' }} />

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
                    <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-[3px] font-bold" style={{ color: '#00FF88', fontFamily: 'var(--font-mono)' }}>MESSAGE DELIVERED</span>
                </div>
              ) : (
                /* ── Project Brief Form ── */
                <div className="relative z-10">
                  {/* Form header with progress ring */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--scarlet-primary)', boxShadow: '0 0 6px var(--scarlet-primary)' }} />
                        <span className="text-[10px] uppercase tracking-[3px] font-bold" style={{ color: 'var(--scarlet-primary)' }}>START A PROJECT</span>
                      </div>

                      <p className="text-[12px] max-w-sm" style={{ color: 'var(--text-muted)' }}>
                        Fill the brief below — watch your estimate update live, and I'll reply within 24 hours.
                      </p>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <span className="text-[11px] font-bold" style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>{progressPercent}%</span>
                      <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: progressPercent > 0 ? 'progressRingPulse 2s ease-in-out infinite' : 'none' }}>
                        {/* Background ring */}
                        <circle cx="20" cy="20" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                        {/* Progress ring */}
                        <circle
                          cx="20" cy="20" r={ringRadius} fill="none"
                          stroke="var(--cyan-primary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Form header divider */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROJECT BRIEF</span>
                    <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('name')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'name' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          YOUR NAME
                        </label>
                        <input
                          name="name" type="text" required
                          placeholder="e.g. Priya Sharma"
                          value={formData.name} onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={fieldStyle('name')}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('email')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'email' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          EMAIL
                        </label>
                        <input
                          name="email" type="email" required
                          placeholder="priya@company.com"
                          value={formData.email} onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={fieldStyle('email')}
                        />
                      </div>
                    </div>

                    {/* Row 2: Mobile + Service Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('mobile')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'mobile' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          MOBILE NUMBER <span style={{ color: 'var(--text-muted)', fontSize: '8px' }}>(OPTIONAL)</span>
                        </label>
                        <input
                          name="mobile" type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.mobile} onChange={handleChange}
                          onFocus={() => setFocusedField('mobile')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={fieldStyle('mobile')}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('service')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'service' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          WHAT DO YOU NEED?
                        </label>
                        <select
                          name="service" required
                          value={formData.service} onChange={handleChange}
                          onFocus={() => setFocusedField('service')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={{ ...fieldStyle('service'), cursor: 'pointer' }}
                        >
                          <option value="" style={{ backgroundColor: '#0D0D0D' }}>Select a service...</option>
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
                    </div>

                    {/* Row 3: Platform Chips */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={{ color: formData.platforms.length > 0 ? 'var(--cyan-primary)' : 'var(--text-muted)', transition: 'color 0.3s ease' }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: formData.platforms.length > 0 ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                        TARGET PLATFORM
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {platformOptions.map(p => {
                          const isSelected = formData.platforms.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => togglePlatform(p.id)}
                              className={`platform-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[1px] ${isSelected ? 'selected' : ''}`}
                              style={{
                                border: `1px solid ${isSelected ? p.color + '60' : 'rgba(255,255,255,0.1)'}`,
                                backgroundColor: isSelected ? p.color + '15' : 'rgba(255,255,255,0.02)',
                                color: isSelected ? p.color : 'var(--text-muted)',
                                boxShadow: isSelected ? `0 0 12px ${p.color}20` : 'none',
                              }}
                            >
                              <span style={{ opacity: isSelected ? 1 : 0.5 }}>{p.icon}</span>
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 4: Deadline + Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('deadline')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'deadline' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          DEADLINE
                        </label>
                        <select
                          name="deadline"
                          value={formData.deadline} onChange={handleChange}
                          onFocus={() => setFocusedField('deadline')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={{ ...fieldStyle('deadline'), cursor: 'pointer' }}
                        >
                          <option value="" style={{ backgroundColor: '#0D0D0D' }}>Select...</option>
                          <option value="Flexible / ongoing" style={{ backgroundColor: '#0D0D0D' }}>Flexible / ongoing</option>
                          <option value="This week" style={{ backgroundColor: '#0D0D0D' }}>This week</option>
                          <option value="Within 2 weeks" style={{ backgroundColor: '#0D0D0D' }}>Within 2 weeks</option>
                          <option value="Within 1 month" style={{ backgroundColor: '#0D0D0D' }}>Within 1 month</option>
                          <option value="ASAP" style={{ backgroundColor: '#0D0D0D' }}>ASAP</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('duration')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'duration' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          DURATION
                        </label>
                        <select
                          name="duration"
                          value={formData.duration} onChange={handleChange}
                          onFocus={() => setFocusedField('duration')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={{ ...fieldStyle('duration'), cursor: 'pointer' }}
                        >
                          <option value="" style={{ backgroundColor: '#0D0D0D' }}>Select...</option>
                          <option value="Under 60 seconds" style={{ backgroundColor: '#0D0D0D' }}>Under 60 seconds</option>
                          <option value="1-5 minutes" style={{ backgroundColor: '#0D0D0D' }}>1-5 minutes</option>
                          <option value="5-15 minutes" style={{ backgroundColor: '#0D0D0D' }}>5-15 minutes</option>
                          <option value="15+ minutes" style={{ backgroundColor: '#0D0D0D' }}>15+ minutes</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Budget + Reference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('budget')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'budget' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          BUDGET RANGE
                        </label>
                        <select
                          name="budget"
                          value={formData.budget} onChange={handleChange}
                          onFocus={() => setFocusedField('budget')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={{ ...fieldStyle('budget'), cursor: 'pointer' }}
                        >
                          <option value="" style={{ backgroundColor: '#0D0D0D' }}>Select budget...</option>
                          <option value="₹2,000 – ₹5,000" style={{ backgroundColor: '#0D0D0D' }}>₹2,000 – ₹5,000</option>
                          <option value="₹5,000 – ₹15,000" style={{ backgroundColor: '#0D0D0D' }}>₹5,000 – ₹15,000</option>
                          <option value="₹15,000 – ₹30,000" style={{ backgroundColor: '#0D0D0D' }}>₹15,000 – ₹30,000</option>
                          <option value="₹30,000+" style={{ backgroundColor: '#0D0D0D' }}>₹30,000+</option>
                          <option value="Let's discuss" style={{ backgroundColor: '#0D0D0D' }}>Let's discuss</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('reference')}>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'reference' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                          REFERENCE <span className="opacity-50">(OPT.)</span>
                        </label>
                        <input
                          name="reference" type="text"
                          placeholder="A style you like"
                          value={formData.reference} onChange={handleChange}
                          onFocus={() => setFocusedField('reference')}
                          onBlur={() => setFocusedField(null)}
                          className="contact-field w-full px-4 py-1.5"
                          style={fieldStyle('reference')}
                        />
                      </div>
                    </div>

                    {/* Row 6: Project Details (full width textarea) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-1.5 text-[9px] uppercase tracking-[2px] font-bold" style={labelStyle('details')}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: focusedField === 'details' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.2)' }} />
                        PROJECT DETAILS
                      </label>
                      <textarea
                        name="details" rows={2}
                        placeholder="What's the goal? What footage do you have? Any style or mood you're going for?"
                        value={formData.details} onChange={handleChange}
                        onFocus={() => setFocusedField('details')}
                        onBlur={() => setFocusedField(null)}
                        className="contact-field w-full px-4 py-1.5 resize-none"
                        style={fieldStyle('details')}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="contact-submit relative inline-flex items-center justify-center px-10 py-2 overflow-hidden w-full mt-1 cursor-pointer"
                      style={{
                        border: '1px solid rgba(255,45,85,0.3)',
                        backgroundColor: 'rgba(255,45,85,0.06)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '8px',
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

                      {/* Continuous shimmer sweep */}
                      <div
                        className="absolute top-0 bottom-0 w-[80px] mix-blend-screen pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.3), transparent)',
                          filter: 'blur(10px)',
                          animation: 'shimmerSweep 3s ease-in-out infinite',
                        }}
                      />

                      {/* Sweep orb on hover */}
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

                      {/* Status dot */}
                      <span className="relative z-10 mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sending ? '#00FF88' : 'var(--scarlet-primary)', boxShadow: `0 0 6px ${sending ? '#00FF88' : 'var(--scarlet-primary)'}`, animation: 'contactBlink 1s ease-in-out infinite' }} />

                      <span className="relative z-10 text-[11px] font-bold uppercase tracking-[3px]" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-heading)' }}>
                        {sending ? 'SENDING...' : 'SEND PROJECT BRIEF'}
                      </span>

                      {!sending && (
                        <span className="relative z-10 ml-4 text-[16px]" style={{ color: 'var(--scarlet-primary)' }}>↗</span>
                      )}
                    </button>
                  </form>
                </div>
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
            © {new Date().getFullYear()} — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/its_divyansh.x/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E1306C', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px #E1306C88) brightness(1.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919369097211"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px #25D36688) brightness(1.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
              title="WhatsApp"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/divyansh-vishwakarma-9a84533a8/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0A66C2', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(0 0 8px #0A66C288) brightness(1.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
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

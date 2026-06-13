/*
 * About — single self-contained cinematic "editor dossier" card.
 *
 * Component choices (reimplemented inline, no shadcn CLI, no new deps — keeps this
 * a one-file drop-in on a Vite+JSX project that has no shadcn/components.json):
 *   • Border Beam   → rotating conic-gradient comet tracing the card edge (Framer).
 *   • Number Ticker → count-up metrics driven by Framer `animate` + `useInView`.
 *   • Meteors/grain → static SVG film grain + pink gradient-mesh texture.
 * Stack: Vite + React + Framer Motion + lucide-react. Brand accent pink #ec4899.
 *
 * Layout: 3 columns on desktop (identity · pitch+metrics+traits · growth+clients+CTA),
 * stacks on mobile. Natural block height (no pin/scrub) so it never overlaps adjacent
 * sections while scrolling. All motion is whileInView/once and respects reduced-motion.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { Timer, Eye, TrendingUp, Music, Megaphone, Star, MapPin, ArrowUpRight } from 'lucide-react';

// Site brand accent — scarlet (matches --scarlet-primary across the site).
const PINK = '#FF2D55';

const metrics = [
  { value: 60, suffix: '+', label: 'CLIENTS', color: PINK },
  { value: 150, suffix: '+', label: 'PROJECTS', color: '#00D9FF' },
  { value: 10, suffix: 'M+', label: 'VIEWS GENERATED', color: '#00FF9D' },
];

const traits = [
  { Icon: Timer, label: '48hr Turnaround' },
  { Icon: Eye, label: 'Cinematic Eye' },
  { Icon: TrendingUp, label: 'Retention Focused' },
  { Icon: Music, label: 'Audio-First' },
  { Icon: Megaphone, label: 'Brand Voice' },
  { Icon: Star, label: '5.0 Avg Rating' },
];

const clients = [
  { name: 'Upgency', slug: 'upgency', from: '#FF2D55', to: '#7c3aed' },
  { name: 'Sikho App', slug: 'sikho-app', from: '#00D9FF', to: '#0ea5e9' },
  { name: 'Kuku FM', slug: 'kuku-fm', from: '#FF2D55', to: '#f97316' },
  { name: 'AssetPlus', slug: 'assetplus', from: '#00FF9D', to: '#10b981' },
  { name: 'Choice Connect', slug: 'choice-connect', from: '#a78bfa', to: '#6366f1' },
  { name: 'Smartmatic Detergent', slug: 'smartmatic-detergent', from: '#fbbf24', to: '#ef4444' },
];

// Seven-point growth 2020 → 2026 (relative height %), 2026 = current/emphasized.
const timeline = [
  { year: 2020, h: 16 },
  { year: 2021, h: 32 },
  { year: 2022, h: 48 },
  { year: 2023, h: 65 },
  { year: 2024, h: 81 },
  { year: 2025, h: 92 },
  { year: 2026, h: 100 },
];

const initials = (name) => {
  const w = name.trim().split(/\s+/);
  return (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase();
};

// ── Count-up metric ──
function NumberTicker({ value, suffix, color, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setDisplay(value); return; }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-black leading-none" style={{ color, fontFamily: 'var(--font-heading)', fontVariantNumeric: 'tabular-nums' }}>
      {display}
      <span className="text-xl sm:text-2xl">{suffix}</span>
    </span>
  );
}

// ── Live HH:MM:SS:FF timecode (isolated re-render; static when reduced) ──
function Timecode({ reduced }) {
  const [tc, setTc] = useState('00:00:00:00');
  const last = useRef('');
  useEffect(() => {
    if (reduced) { setTc('00:14:22:08'); return; }
    const start = performance.now();
    let raf = 0;
    const pad = (n) => String(n).padStart(2, '0');
    const loop = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      const f = frames % 24;
      const s = Math.floor(frames / 24) % 60;
      const m = Math.floor(frames / 1440) % 60;
      const h = Math.floor(frames / 86400) % 24;
      const next = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      if (next !== last.current) { last.current = next; setTc(next); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return <span>{tc}</span>;
}

// ── Client logo: SVG if present, gradient letter-mark fallback ──
function ClientLogo({ c }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      {!err ? (
        <img src={`/clients/${c.slug}.svg`} onError={() => setErr(true)} alt={`${c.name} logo`} className="w-7 h-7 object-contain flex-shrink-0" />
      ) : (
        <span aria-hidden="true" className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
          {initials(c.name)}
        </span>
      )}
      <span className="text-[10px] font-bold uppercase tracking-wide leading-tight" style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
    </div>
  );
}

export default function About() {
  const reduced = useReducedMotion();
  const [portraitErr, setPortraitErr] = useState(false);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
  const barVar = reduced
    ? { hidden: { scaleY: 1 }, show: { scaleY: 1 } }
    : { hidden: { scaleY: 0 }, show: (i) => ({ scaleY: 1, transition: { duration: 0.7, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] } }) };

  return (
    <section id="about" className="relative w-full overflow-hidden py-16 md:py-24 scroll-mt-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <style>{`
        @keyframes aboutShimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
        @keyframes aboutRecBlink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
        @media (prefers-reduced-motion: reduce) {
          .about-shimmer, .about-beam, .about-rec { animation: none !important; }
        }
      `}</style>

      {/* Pink gradient-mesh ambience */}
      <div aria-hidden="true" className="absolute -top-24 right-0 w-[520px] h-[520px] pointer-events-none z-0" style={{ background: `radial-gradient(circle, ${PINK}1f 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      <div aria-hidden="true" className="absolute -bottom-24 left-0 w-[420px] h-[420px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }} />

      <div className="w-full px-5 sm:px-8 md:px-16 relative z-10 flex justify-center">
        {/* Section label */}
        <motion.div
          className="w-full max-w-6xl"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={item} className="flex items-center gap-3 mb-5">
            <span className="about-rec w-2 h-2 rounded-full" style={{ backgroundColor: PINK, boxShadow: `0 0 8px ${PINK}`, animation: 'aboutRecBlink 1.4s ease-in-out infinite' }} />
            <span className="text-[11px] uppercase tracking-[3px] font-bold" style={{ color: PINK }}>ABOUT THE EDITOR</span>
            <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${PINK}, transparent)` }} />
          </motion.div>

          {/* ── The card ── */}
          <div className="relative rounded-2xl">
            {/* Border beam */}
            <div aria-hidden="true" className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.div
                className="about-beam absolute"
                style={{
                  width: '180%', height: '180%', top: '-40%', left: '-40%',
                  background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${PINK} 340deg, #FF6B85 352deg, transparent 360deg)`,
                }}
                animate={reduced ? {} : { rotate: 360 }}
                transition={reduced ? {} : { duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Card body (1px inset reveals the beam as a thin ring) */}
            <div className="relative m-px rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(11,11,13,0.92)', backdropFilter: 'blur(20px)' }}>
              {/* Film grain */}
              <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'overlay', opacity: 0.06 }}>
                <filter id="about-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
                <rect width="100%" height="100%" filter="url(#about-grain)" />
              </svg>

              <div className="relative grid grid-cols-1 lg:grid-cols-[260px_1fr_290px]">

                {/* ───────── LEFT · Identity ───────── */}
                <motion.div variants={item} className="p-6 lg:p-7 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  {/* HUD: REC + timecode */}
                  <div aria-hidden="true" className="flex items-center justify-between mb-4 font-mono text-[9px] tracking-[2px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5" style={{ color: '#f87171' }}>
                      <span className="about-rec w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444', animation: 'aboutRecBlink 1.4s ease-in-out infinite' }} />
                      REC
                    </span>
                    <Timecode reduced={reduced} />
                  </div>

                  {/* Portrait with focus brackets */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)', background: `linear-gradient(150deg, ${PINK}22, #0a0a0c)` }}>
                    {!portraitErr ? (
                      <img src="/divyansh-portrait.jpg" onError={() => setPortraitErr(true)} alt="Portrait of Divyansh Vishwakarma" className="w-full h-full object-cover" style={{ objectPosition: 'center 28%' }} />
                    ) : (
                      <div aria-hidden="true" className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-black tracking-tight" style={{ color: PINK, fontFamily: 'var(--font-heading)', textShadow: `0 0 30px ${PINK}66` }}>DV</span>
                      </div>
                    )}
                    {/* focus brackets */}
                    {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((c) => (
                      <span key={c} aria-hidden="true" className={`absolute w-4 h-4 ${c}`} style={{ borderColor: PINK }} />
                    ))}
                  </div>

                  <h3 className="text-white text-xl font-black uppercase tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Divyansh Vishwakarma</h3>
                  <p className="text-[12px] font-bold uppercase tracking-[2px] mt-1" style={{ color: PINK }}>Creative Video Editor</p>
                  <p className="flex items-center gap-1.5 text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={12} aria-hidden="true" /> India · Available remote worldwide
                  </p>
                </motion.div>

                {/* ───────── CENTER · Pitch + Metrics + Traits ───────── */}
                <div className="p-6 lg:p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <motion.p variants={item} className="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-[1.45]" style={{ fontFamily: 'var(--font-heading)' }}>
                    I turn raw footage into polished, scroll-stopping videos that brands trust to drive engagement <span style={{ color: PINK }}>— from podcast reels to commercial spots.</span>
                  </motion.p>

                  {/* Metrics */}
                  <motion.div variants={item} className="grid grid-cols-3 gap-3">
                    {metrics.map((m) => (
                      <div key={m.label} className="flex flex-col gap-1">
                        <NumberTicker value={m.value} suffix={m.suffix} color={m.color} reduced={reduced} />
                        <span className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                        <span className="h-[2px] rounded-full mt-0.5" style={{ backgroundColor: m.color, opacity: 0.5 }} />
                      </div>
                    ))}
                  </motion.div>

                  {/* Trait chips */}
                  <motion.div variants={item} className="flex flex-wrap gap-2">
                    {traits.map(({ Icon, label }) => (
                      <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                        <Icon size={13} aria-hidden="true" style={{ color: PINK }} />
                        {label}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* ───────── RIGHT · Growth + Clients + CTA ───────── */}
                <motion.div variants={item} className="p-6 lg:p-7 flex flex-col gap-5">
                  {/* Growth bars */}
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[2px] mb-3 font-mono" style={{ color: 'var(--text-muted)' }}>GROWTH · 2020—2026</div>
                    <div className="flex items-end justify-between gap-1.5 h-24">
                      {timeline.map((t, i) => {
                        const isNow = t.year === 2026;
                        return (
                          <div key={t.year} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                            <div className="relative w-full flex items-end justify-center" style={{ height: '100%' }}>
                              {isNow && (
                                <span className="absolute -top-1 text-[7px] font-black px-1 py-0.5 rounded" style={{ color: '#fff', backgroundColor: PINK, letterSpacing: '1px' }}>NOW</span>
                              )}
                              <motion.span
                                className="block w-full rounded-t-sm"
                                style={{
                                  height: `${t.h}%`,
                                  transformOrigin: 'bottom',
                                  background: isNow ? `linear-gradient(180deg, ${PINK}, #C2153B)` : 'rgba(255,255,255,0.14)',
                                  boxShadow: isNow ? `0 0 14px ${PINK}88` : 'none',
                                }}
                                variants={barVar}
                                custom={i}
                              />
                            </div>
                            <span className="text-[8px] font-mono" style={{ color: isNow ? PINK : 'var(--text-muted)', fontWeight: isNow ? 800 : 400 }}>{String(t.year).slice(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Client roster */}
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[2px] mb-2.5 font-mono" style={{ color: 'var(--text-muted)' }}>TRUSTED BY</div>
                    <div className="grid grid-cols-2 gap-2">
                      {clients.map((c) => <ClientLogo key={c.slug} c={c} />)}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-1">
                    <a
                      href="#contact"
                      className="about-cta group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg overflow-hidden font-bold text-[12px] uppercase tracking-[2px] text-white"
                      style={{ background: `linear-gradient(135deg, ${PINK}, #C2153B)`, boxShadow: `0 8px 24px ${PINK}44` }}
                    >
                      <span aria-hidden="true" className="about-shimmer absolute top-0 bottom-0 w-1/3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', animation: 'aboutShimmer 2.6s ease-in-out infinite' }} />
                      <span className="relative">Start a project</span>
                      <ArrowUpRight size={15} aria-hidden="true" className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <p className="flex items-center justify-center gap-1.5 text-[10px] mt-2.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="about-rec w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00FF9D', boxShadow: '0 0 6px #00FF9D', animation: 'aboutRecBlink 1.6s ease-in-out infinite' }} />
                      Replies in under 2 hours
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/*
 * ServicesAccordion — mobile-only vertical expanding accordion for the
 * Services section. Collapses the 8 tall service cards into thin tappable
 * rows; tapping one expands it (one open at a time) to reveal the description,
 * deliverables and turnaround. An explicit ENQUIRE button preserves the
 * original card's click-to-enquire behaviour.
 *
 * Visuals (corner brackets, neon color glow, deliverable pills) are kept
 * 1:1 with the desktop <Services /> cards. Receives the same `services`
 * array as a prop so the icon SVGs aren't duplicated.
 */

const EASE = [0.16, 1, 0.3, 1];

export default function ServicesAccordion({ services = [] }) {
  const [openId, setOpenId] = useState(services[0]?.id ?? null);

  const enquire = (id) => {
    localStorage.setItem('selectedService', id);
    window.dispatchEvent(new CustomEvent('serviceSelected'));
  };

  return (
    <div className="flex flex-col gap-3">
      {services.map((svc) => {
        const isOpen = openId === svc.id;
        return (
          <div
            key={svc.id}
            className="relative overflow-hidden"
            style={{
              border: `1px solid ${isOpen ? `${svc.color}55` : 'rgba(255,255,255,0.06)'}`,
              backgroundColor: isOpen ? `${svc.color}08` : 'rgba(13,13,13,0.5)',
              backdropFilter: 'blur(16px)',
              boxShadow: isOpen ? `0 0 30px ${svc.color}20, inset 0 0 20px ${svc.color}06` : 'none',
              transition: 'border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {/* Left color accent bar */}
            <span
              className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
              style={{ backgroundColor: svc.color, opacity: isOpen ? 1 : 0.35, transition: 'opacity 0.4s ease' }}
            />

            {/* Corner brackets */}
            <span className="absolute top-2 left-2 w-3 h-3 border-t border-l pointer-events-none transition-colors duration-300"
              style={{ borderColor: isOpen ? svc.color : 'rgba(255,255,255,0.1)' }} />
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r pointer-events-none transition-colors duration-300"
              style={{ borderColor: isOpen ? svc.color : 'rgba(255,255,255,0.1)' }} />

            {/* ── Header (always visible, tap to toggle) ── */}
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : svc.id)}
              aria-expanded={isOpen}
              className="relative w-full flex items-center gap-3 p-4 pl-5 text-left"
            >
              {/* Icon */}
              <div
                className="flex-shrink-0"
                style={{ color: isOpen ? svc.color : 'var(--text-muted)', transition: 'color 0.4s ease', transform: isOpen ? 'scale(1.1)' : 'scale(1)' }}
              >
                {svc.icon}
              </div>

              {/* Code + title */}
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-[2px] mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  SVC_{svc.code}
                </span>
                <h3 className="text-white text-[15px] font-black uppercase tracking-wide leading-tight truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                  {svc.title}
                </h3>
              </div>

              {/* Tag pill */}
              <div className="flex flex-shrink-0 items-center gap-1.5 px-2 py-1" style={{ border: `1px solid ${svc.color}40`, backgroundColor: `${svc.color}0D` }}>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: svc.color }} />
                <span className="text-[8px] font-black uppercase tracking-[1.5px]" style={{ color: svc.color }}>{svc.tag}</span>
              </div>

              {/* Chevron */}
              <motion.span
                className="flex-shrink-0"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ color: isOpen ? svc.color : 'var(--text-muted)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.span>
            </button>

            {/* ── Expandable body ── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: EASE }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-5 pb-5">
                    {/* Description */}
                    <p className="text-[12px] leading-[1.7] mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {svc.desc}
                    </p>

                    {/* Deliverables */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {svc.deliverables.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-1 text-[9px] font-bold uppercase tracking-[1px]"
                          style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Footer: turnaround + enquire */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TURNAROUND</span>
                        <span className="text-[11px] font-black uppercase tracking-[1px]" style={{ color: svc.color }}>{svc.turnaround}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => enquire(svc.id)}
                        className="inline-flex items-center gap-2 px-4 py-2"
                        style={{ border: `1px solid ${svc.color}66`, backgroundColor: `${svc.color}12` }}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[2px]" style={{ color: svc.color }}>ENQUIRE</span>
                        <span className="text-[13px]" style={{ color: svc.color }}>↗</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

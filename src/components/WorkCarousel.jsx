import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/*
 * WorkCarousel — Connoisseur Stack Interactor (mobile only).
 * A physical-deck of the existing Work cards. The top card is draggable on X;
 * flick it past ~80px (or with enough velocity) and it springs out while the
 * card beneath rises to the top. Cards cycle endlessly through the deck.
 *
 * Card visuals are copied 1:1 from <Work />: grain overlay, neon spotlight,
 * BackgroundMedia, play/eye icon, colored pill badge, uppercase title, link row.
 */

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;
const MAX_VISIBLE = 3;

// Mirrors <Work />'s BackgroundMedia: lazy media that fades in once near view.
const CardMedia = ({ videoUrl, imageUrl }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50">
      {visible && videoUrl && (
        <video src={`${videoUrl}#t=0.1`} className="w-full h-full object-cover" preload="metadata" muted playsInline />
      )}
      {visible && !videoUrl && imageUrl && (
        <img src={imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
      )}
    </div>
  );
};

// Link/footer text per tab — matches the desktop grid copy exactly.
const linkTextFor = (variant) =>
  variant === 'shooted' ? '4K // RAW FOOTAGE' : variant === 'graphics' ? 'VIEW DESIGN ↗' : 'ENTER ARCHIVE ↗';

// Centered glyph: eye for graphics, play triangle otherwise (matches grid).
const CenterIcon = ({ variant, color }) => (
  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border"
      style={{ backgroundColor: 'rgba(13,13,13,0.4)', borderColor: color }}
    >
      {variant === 'graphics' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[11px] border-l-white border-b-[6px] border-b-transparent ml-1" />
      )}
    </div>
  </div>
);

// Single deck card. Hooks live here so the front card can rotate with drag.
function DeckCard({ item, pos, total, counter, variant, onSwipe, onSelect }) {
  const isFront = pos === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const moved = useRef(false);

  // Contact ("Start a Conversation") card — only in shooted/graphics decks.
  if (item.__contact) {
    return (
      <motion.article
        className="absolute inset-0 rounded-xl overflow-hidden border flex flex-col items-center justify-center"
        style={{ borderColor: 'var(--scarlet-primary)', backgroundColor: 'var(--bg-surface)', zIndex: total - pos, touchAction: 'pan-y', x: isFront ? x : 0, rotate: isFront ? rotate : 0 }}
        drag={isFront ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragDirectionLock
        onDragStart={() => { moved.current = false; }}
        onDrag={(_, info) => { if (Math.abs(info.offset.x) > 4) moved.current = true; }}
        onDragEnd={isFront ? (_, info) => {
          if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY) {
            onSwipe(info.offset.x > 0 ? 1 : -1);
          }
        } : undefined}
        onClick={() => { if (isFront && !moved.current) onSelect(item); }}
        custom={exitDir}
        variants={{ exit: (dir) => ({ x: dir * 520, opacity: 0, rotate: dir > 0 ? 18 : -18, transition: { duration: 0.35 } }) }}
        initial={{ scale: 0.82, y: 42, opacity: 0 }}
        animate={isFront ? { scale: 1, y: 0, opacity: 1 } : { scale: 1 - pos * 0.06, y: pos * 16, opacity: 1 }}
        exit="exit"
        transition={SPRING}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 opacity-80" />
        <div className="z-10 w-16 h-16 rounded-full border border-dashed flex items-center justify-center mb-4 bg-black/30 backdrop-blur-sm" style={{ borderColor: 'var(--scarlet-primary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--scarlet-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="z-10 text-white text-md font-bold uppercase tracking-widest text-center">Start a<br />Conversation</span>
        <span className="z-10 text-[9px] uppercase tracking-[2px] mt-3" style={{ color: 'var(--text-muted)' }}>LET'S WORK TOGETHER ↗</span>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="absolute inset-0 rounded-xl overflow-hidden border cursor-grab active:cursor-grabbing"
      style={{
        borderColor: isFront ? item.color : 'var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: isFront ? `0 15px 40px ${item.color}22` : '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: total - pos,
        touchAction: 'pan-y',
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragDirectionLock
      onDragStart={() => { moved.current = false; }}
      onDrag={(_, info) => { if (Math.abs(info.offset.x) > 4) moved.current = true; }}
      onDragEnd={isFront ? (_, info) => {
        if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY) {
          onSwipe(info.offset.x > 0 ? 1 : -1);
        }
      } : undefined}
      onClick={() => { if (isFront && !moved.current) onSelect(item); }}
      custom={exitDir}
      variants={{ exit: (dir) => ({ x: dir * 520, opacity: 0, rotate: dir > 0 ? 18 : -18, transition: { duration: 0.35 } }) }}
      initial={{ scale: 0.82, y: 42, opacity: 0 }}
      animate={isFront
        ? { scale: 1, y: 0, opacity: 1 }
        : { scale: 1 - pos * 0.06, y: pos * 16, opacity: 1 }}
      exit="exit"
      transition={SPRING}
    >
      {/* Grainy noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10" />
      {/* Neon spotlight backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-85">
        <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: item.color }} />
      </div>

      <CardMedia videoUrl={item.videoUrl} imageUrl={item.imageUrl} />

      <CenterIcon variant={variant} color={item.color} />

      {/* Counter — top right of the active card */}
      {isFront && (
        <span className="absolute top-3 right-3 z-30 font-mono text-[10px] tracking-[2px] px-2 py-0.5 rounded-md backdrop-blur-sm" style={{ color: item.color, backgroundColor: 'rgba(13,13,13,0.55)', border: `1px solid ${item.color}55` }}>
          {counter}
        </span>
      )}

      {/* Info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.3)] to-transparent opacity-90 z-10 flex flex-col justify-end p-6 pointer-events-none">
        <span className="inline-block self-start px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border backdrop-blur-sm mb-2" style={{ color: item.color, borderColor: item.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
          {item.tag}
        </span>
        <span className="text-white text-md font-bold uppercase tracking-widest">{item.title}</span>
        <span className="text-[9px] uppercase tracking-[2px] mt-1" style={{ color: 'var(--text-muted)' }}>{linkTextFor(variant)}</span>
      </div>
    </motion.article>
  );
}

// Module-scoped so AnimatePresence's `custom` resolver and the card variant agree.
let exitDir = 1;

export default function WorkCarousel({ items = [], variant = 'edited' }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [, force] = useState(0);

  const total = items.length;
  if (!total) return null;

  const visible = Math.min(MAX_VISIBLE, total);

  const handleSwipe = (dir) => {
    exitDir = dir;
    force((n) => n + 1); // ensure the new exitDir is read by the exiting card
    setIndex((i) => (i + 1) % total);
  };

  const handleSelect = (item) => {
    if (item.__contact) {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Only "edited" cards navigate to an archive — matches the desktop grid.
    if (variant === 'edited') navigate(`/work/${item.id}`);
  };

  // Window of stacked cards (front = pos 0).
  const window = [];
  for (let i = 0; i < visible; i++) {
    window.push({ item: items[(index + i) % total], pos: i });
  }

  return (
    <div className="w-full">
      {/* Deck stage */}
      <div className="relative w-full aspect-video select-none" style={{ perspective: '1200px' }}>
        <AnimatePresence custom={exitDir} initial={false}>
          {window
            .slice()
            .reverse() // render back-to-front so pos 0 paints on top
            .map(({ item, pos }) => (
              <DeckCard
                key={item.__contact ? '__contact' : item.id}
                item={item}
                pos={pos}
                total={total}
                counter={`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
                variant={variant}
                onSwipe={handleSwipe}
                onSelect={handleSelect}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap px-4">
        {items.map((it, i) => (
          <button
            key={it.__contact ? '__contact-dot' : it.id}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => setIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === index ? 22 : 7,
              height: 7,
              backgroundColor: i === index ? 'var(--scarlet-primary)' : 'rgba(255,255,255,0.22)',
            }}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <p className="text-center font-mono text-[10px] tracking-[0.25em] mt-4" style={{ color: 'var(--text-muted)' }}>
        ← SWIPE TO BROWSE →
      </p>
    </div>
  );
}

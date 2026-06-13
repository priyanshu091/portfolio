import { useEffect, useRef, useState, useCallback } from 'react';
import type { Tool } from '../../lib/tools-data';

interface ToolCardSwiperProps {
  tools: Tool[];
  /** Fired whenever the top (active) card changes, with its index into `tools`. */
  onActiveChange?: (index: number) => void;
  /** Card click (e.g. navigate to that tool's projects). */
  onSelect?: (tool: Tool) => void;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

const CORNERS = [
  'top-2 left-2 border-t border-l',
  'top-2 right-2 border-t border-r',
  'bottom-2 left-2 border-b border-l',
  'bottom-2 right-2 border-b border-r',
];

/**
 * A draggable card stack (Tinder-style) showing the editing tools.
 * Adapted from the shadcn ImageSwiper pattern, but renders tool cards from
 * `tools-data` instead of image URLs and reports the active card upward so the
 * cinema HUD scene strip can follow it.
 */
export default function ToolCardSwiper({
  tools,
  onActiveChange,
  onSelect,
  cardWidth = 200,
  cardHeight = 280,
  className = '',
}: ToolCardSwiperProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const rafId = useRef<number | null>(null);
  const movedDuringPress = useRef(false);

  const [order, setOrder] = useState<number[]>(() => tools.map((_, i) => i));

  // Report the active (front) card upward.
  useEffect(() => {
    if (order.length) onActiveChange?.(order[0]);
  }, [order, onActiveChange]);

  const getCards = useCallback((): HTMLElement[] => {
    if (!stackRef.current) return [];
    return [...stackRef.current.querySelectorAll('.tool-card')] as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => getCards()[0] || null, [getCards]);

  const updatePositions = useCallback(() => {
    getCards().forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
    });
  }, [getCards]);

  const applySwipeStyles = useCallback(
    (deltaX: number) => {
      const card = getActiveCard();
      if (!card) return;
      card.style.setProperty('--swipe-x', `${deltaX}px`);
      card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`);
      card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString();
    },
    [getActiveCard],
  );

  const handleStart = useCallback(
    (clientX: number) => {
      if (isSwiping.current) return;
      isSwiping.current = true;
      movedDuringPress.current = false;
      startX.current = clientX;
      currentX.current = clientX;
      const card = getActiveCard();
      if (card) card.style.transition = 'none';
    },
    [getActiveCard],
  );

  const DURATION = 350;

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${direction * 320}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);
        setTimeout(() => {
          setOrder((prev) => (prev.length ? [...prev.slice(1), prev[0]] : prev));
        }, DURATION);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [getActiveCard, applySwipeStyles]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isSwiping.current) return;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        currentX.current = clientX;
        const deltaX = currentX.current - startX.current;
        if (Math.abs(deltaX) > 4) movedDuringPress.current = true;
        applySwipeStyles(deltaX);
        if (Math.abs(deltaX) > 60) handleEnd();
      });
    },
    [applySwipeStyles, handleEnd],
  );

  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const down = (e: PointerEvent) => handleStart(e.clientX);
    const move = (e: PointerEvent) => handleMove(e.clientX);
    const up = () => handleEnd();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointerleave', up);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [order, updatePositions]);

  return (
    <section
      ref={stackRef}
      className={`relative grid place-content-center select-none ${className}`}
      style={
        {
          width: cardWidth + 32,
          height: cardHeight + 32,
          touchAction: 'none',
          transformStyle: 'preserve-3d',
          '--card-perspective': '700px',
          '--card-z-offset': '14px',
          '--card-y-offset': '9px',
        } as React.CSSProperties
      }
    >
      {order.map((originalIndex, displayIndex) => {
        const tool = tools[originalIndex];
        const isFront = displayIndex === 0;
        return (
          <article
            key={tool.id}
            className="tool-card absolute place-self-center rounded-2xl overflow-hidden will-change-transform cursor-grab active:cursor-grabbing"
            onClick={() => {
              if (!movedDuringPress.current && isFront) onSelect?.(tool);
            }}
            style={{
              '--i': (displayIndex + 1).toString(),
              zIndex: tools.length - displayIndex,
              width: cardWidth,
              height: cardHeight,
              background: `linear-gradient(160deg, ${tool.gradient[0]}, ${tool.gradient[1]})`,
              border: `1px solid ${isFront ? '#ec4899' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: isFront
                ? `0 0 0 1px #ec4899, 0 0 34px ${tool.color}55, 0 18px 50px rgba(0,0,0,0.6)`
                : '0 12px 30px rgba(0,0,0,0.5)',
              transform: `perspective(var(--card-perspective))
                          translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                          translateY(calc(var(--card-y-offset) * var(--i)))
                          translateX(var(--swipe-x, 0px))
                          rotateY(var(--swipe-rotate, 0deg))`,
            } as React.CSSProperties}
          >
            {/* SUBJ top strip */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2">
              <span className="font-mono text-[8px] tracking-widest text-white/60">SUBJ · {String(originalIndex + 1).padStart(2, '0')}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            </div>

            {/* Corner focus brackets (front card only) */}
            {isFront &&
              CORNERS.map((c) => (
                <span key={c} className={`absolute w-3 h-3 ${c}`} style={{ borderColor: '#ec4899' }} />
              ))}

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-4 h-[1px] bg-white/15" />
              <div className="absolute h-4 w-[1px] bg-white/15" />
            </div>

            {/* Abbreviation + name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 pointer-events-none">
              <span
                className="font-black leading-none"
                style={{
                  color: tool.color,
                  fontSize: tool.abbr.length > 2 ? 26 : 52,
                  textShadow: `0 0 22px ${tool.color}99`,
                }}
              >
                {tool.abbr}
              </span>
              <span className="text-sm font-semibold text-white/90 text-center leading-tight">{tool.name}</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-white/45 mt-1">{tool.tagline}</span>
            </div>

            {/* Exposure strip */}
            <div
              className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <span className="font-mono text-[8px] tracking-widest text-white/55">{tool.projectsCount} PROJECTS</span>
              <span className="font-mono text-[8px] tracking-widest" style={{ color: tool.color }}>+0.3 EV</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

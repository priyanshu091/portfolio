import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Moving film grain via an animated <feTurbulence> seed.
 * Sits above the scene but below the HUD (z-20). Static when reduced motion is on.
 */
export default function FilmGrain() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let seed = 0;
    const loop = () => {
      seed = (seed + 1) % 100;
      turbRef.current?.setAttribute('seed', String(seed));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ mixBlendMode: 'overlay', opacity: 0.08 }}
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        <filter id="film-grain-filter">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={0}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
      </svg>
    </div>
  );
}

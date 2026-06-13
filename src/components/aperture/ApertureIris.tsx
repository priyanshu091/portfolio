import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface ApertureIrisProps {
  /**
   * 0 = fully closed, 1 = fully open.
   * If omitted, the iris opens on hover — handy for verifying the animation standalone.
   */
  progress?: MotionValue<number>;
  /** Square render size in px. */
  size?: number;
  className?: string;
}

const BLADES = [0, 1, 2, 3, 4, 5, 6, 7];

// One blade petal, authored with its PIVOT at local (0,0) and the tip
// extending down to ~(0,82). Each blade is then placed by:
//   rotate(i*45) translate(0 -70) rotate(R) scale(S)
// so the open transform (R,S) happens about the rim pivot, not the lens centre.
const BLADE_PATH = 'M0 0 C-16 16 -20 48 -11 76 C-7 85 7 85 11 76 C20 48 16 16 0 0 Z';

export default function ApertureIris({ progress, size = 320, className }: ApertureIrisProps) {
  const prefersReduced = useReducedMotion();

  // Fallback driver used only when no external `progress` is supplied (standalone/hover test).
  const internal = useMotionValue(prefersReduced ? 1 : 0);
  const p = progress ?? internal;

  // Two motion values per the brief: blades rotate AND retract as the iris opens.
  const rotation = useTransform(p, [0, 1], [0, 22]);     // 0° closed -> 22° open
  const bladeScale = useTransform(p, [0, 1], [1, 0.35]); // 1 closed  -> 0.35 open
  const flareOpacity = useTransform(p, [0.35, 0.5, 0.7], [0, 0.9, 0]);
  const glowOpacity = useTransform(p, [0, 1], [0.12, 0.5]);

  const bladeRefs = useRef<(SVGPathElement | null)[]>([]);

  // Drive the blade `transform` ATTRIBUTE imperatively. Using the SVG transform
  // list keeps the rim-pivot math unambiguous and avoids cross-browser
  // transform-origin issues you'd hit applying CSS transforms to SVG paths.
  useEffect(() => {
    const apply = () => {
      const r = rotation.get();
      const s = bladeScale.get();
      for (let i = 0; i < bladeRefs.current.length; i++) {
        const el = bladeRefs.current[i];
        if (el) {
          el.setAttribute(
            'transform',
            `rotate(${i * 45}) translate(0 -70) rotate(${r}) scale(${s})`,
          );
        }
      }
    };
    apply();
    const unsubR = rotation.on('change', apply);
    const unsubS = bladeScale.on('change', apply);
    return () => {
      unsubR();
      unsubS();
    };
  }, [rotation, bladeScale]);

  // Hover-to-open only when there's no external driver and motion is allowed.
  const hoverEnabled = !progress && !prefersReduced;
  const hoverHandlers = hoverEnabled
    ? {
        onMouseEnter: () => animate(internal, 1, { duration: 0.85, ease: [0.16, 1, 0.3, 1] }),
        onMouseLeave: () => animate(internal, 0, { duration: 0.6, ease: [0.16, 1, 0.3, 1] }),
      }
    : {};

  return (
    <div className={className} style={{ width: size, height: size }} {...hoverHandlers}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true">
        <defs>
          {/* Lens barrel */}
          <radialGradient id="ap-barrel" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#1b1322" />
            <stop offset="55%" stopColor="#0d0a12" />
            <stop offset="100%" stopColor="#050506" />
          </radialGradient>
          {/* Bloom revealed through the opening */}
          <radialGradient id="ap-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          {/* Brushed-metal blade fill */}
          <linearGradient id="ap-blade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#23232c" />
            <stop offset="55%" stopColor="#141118" />
            <stop offset="100%" stopColor="#08070b" />
          </linearGradient>
          {/* Keep blades inside the barrel */}
          <clipPath id="ap-clip">
            <circle cx="0" cy="0" r="82" />
          </clipPath>
        </defs>

        {/* Barrel + inner shadow ring */}
        <circle cx="0" cy="0" r="98" fill="url(#ap-barrel)" />
        <circle cx="0" cy="0" r="90" fill="none" stroke="#000000" strokeOpacity="0.6" strokeWidth="6" />

        {/* Glow behind the blades — brightens as the iris opens */}
        <motion.circle cx="0" cy="0" r="62" fill="url(#ap-glow)" style={{ opacity: glowOpacity }} />

        {/* The 8 aperture blades */}
        <g clipPath="url(#ap-clip)">
          {BLADES.map((i) => (
            <path
              key={i}
              ref={(el) => {
                bladeRefs.current[i] = el;
              }}
              d={BLADE_PATH}
              fill="url(#ap-blade)"
              stroke="#ec4899"
              strokeOpacity="0.14"
              strokeWidth="0.6"
            />
          ))}
        </g>

        {/* Pink rim highlight (brand) + faint inner ring */}
        <circle cx="0" cy="0" r="88" fill="none" stroke="#ec4899" strokeOpacity="0.3" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="82" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />

        {/* Engraved f-stops around the rim */}
        {[
          { t: 'f/2.8', x: 0, y: -93 },
          { t: 'f/4', x: 67, y: 71 },
          { t: 'f/5.6', x: 0, y: 96 },
          { t: 'f/8', x: -67, y: 71 },
        ].map((m) => (
          <text
            key={m.t}
            x={m.x}
            y={m.y}
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="7"
            letterSpacing="1"
            fill="#ffffff"
            fillOpacity="0.28"
          >
            {m.t}
          </text>
        ))}

        {/* Lens flare — crossing streaks that fade in mid-open then out */}
        <motion.g style={{ opacity: flareOpacity }} strokeLinecap="round">
          <line x1="-120" y1="-120" x2="120" y2="120" stroke="#fda4f0" strokeOpacity="0.5" strokeWidth="1" />
          <line x1="120" y1="-120" x2="-120" y2="120" stroke="#fda4f0" strokeOpacity="0.32" strokeWidth="1" />
          <line x1="-130" y1="0" x2="130" y2="0" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.7" />
        </motion.g>
      </svg>
    </div>
  );
}

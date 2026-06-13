import { motion } from 'framer-motion';
import type { Tool } from '../../lib/tools-data';

interface ViewfinderCardProps {
  tool: Tool;
  focused: boolean;
  reducedMotion?: boolean;
  onSelect: () => void;
}

const CORNERS = [
  'top-1 left-1 border-t border-l',
  'top-1 right-1 border-t border-r',
  'bottom-1 left-1 border-b border-l',
  'bottom-1 right-1 border-b border-r',
];

export default function ViewfinderCard({ tool, focused, reducedMotion, onSelect }: ViewfinderCardProps) {
  const duration = reducedMotion ? 0.1 : 0.4;

  return (
    // Fixed-width slot keeps row spacing stable while the button inside grows/shrinks.
    <div className="relative flex flex-col items-center" style={{ width: 140 }}>
      {/* ◆ IN FOCUS ◆ floating label */}
      <div className="h-5 mb-1 flex items-center justify-center">
        <motion.span
          animate={{ opacity: focused ? 1 : 0, y: focused ? 0 : 4 }}
          transition={{ duration }}
          className="font-mono text-[9px] tracking-[0.2em]"
          style={{ color: '#6ee7b7' }}
        >
          ◆ IN FOCUS ◆
        </motion.span>
      </div>

      <motion.button
        type="button"
        onClick={onSelect}
        aria-label={`View ${tool.name} projects`}
        initial={false}
        animate={{
          width: focused ? 140 : 80,
          scale: focused ? 1 : 0.88,
          opacity: focused ? 1 : 0.5,
          filter: focused ? 'blur(0px)' : 'blur(4px)',
          boxShadow: focused
            ? `0 0 0 1px #ec4899, 0 0 28px ${tool.color}66, 0 0 60px #ec489933`
            : '0 0 0 1px rgba(255,255,255,0.05)',
        }}
        transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(160deg, ${tool.gradient[0]}, ${tool.gradient[1]})` }}
      >
        {/* SUBJ top strip */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-1.5 py-1">
          <span className="font-mono text-[7px] tracking-widest text-white/60">SUBJ</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
        </div>

        {/* Corner focus brackets */}
        {CORNERS.map((c) => (
          <span key={c} className={`absolute w-2.5 h-2.5 ${c}`} style={{ borderColor: '#ec4899' }} />
        ))}

        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-3 h-[1px] bg-white/20" />
          <div className="absolute h-3 w-[1px] bg-white/20" />
        </div>

        {/* Abbreviation + name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1">
          <span
            className="font-black leading-none"
            style={{
              color: tool.color,
              fontSize: tool.abbr.length > 2 ? 15 : 30,
              textShadow: `0 0 18px ${tool.color}88`,
            }}
          >
            {tool.abbr}
          </span>
          <span className="text-[11px] font-semibold text-white/85 text-center leading-tight">{tool.name}</span>
        </div>

        {/* Fake exposure strip */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-1.5 py-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <span className="font-mono text-[7px] tracking-widest text-white/55">EDIT</span>
          <span className="font-mono text-[7px] tracking-widest" style={{ color: tool.color }}>+0.3 EV</span>
        </div>
      </motion.button>
    </div>
  );
}

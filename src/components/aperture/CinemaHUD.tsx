import { useEffect, useRef, useState } from 'react';

function formatTimecode(totalFrames: number): string {
  const fps = 24;
  const f = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600) % 24;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

const CORNERS = [
  'top-3 left-3 border-t border-l',
  'top-3 right-3 border-t border-r',
  'bottom-3 left-3 border-b border-l',
  'bottom-3 right-3 border-b border-r',
];

export default function CinemaHUD({ toolName }: { toolName: string }) {
  const [tc, setTc] = useState('00:00:00:00');
  const lastRef = useRef('');

  // Real-time counting timecode (HH:MM:SS:FF @ 24fps). Only re-render when the
  // displayed frame actually changes.
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      const next = formatTimecode(frames);
      if (next !== lastRef.current) {
        lastRef.current = next;
        setTc(next);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-none select-none font-mono text-[9px] tracking-[0.15em] text-white/55"
      aria-hidden="true"
    >
      {/* Pink corner focus brackets */}
      {CORNERS.map((c) => (
        <span key={c} className={`absolute w-3.5 h-3.5 ${c}`} style={{ borderColor: '#ec4899', borderWidth: '1px' }} />
      ))}

      {/* Top-left: REC + timecode */}
      <div className="absolute top-5 left-6 flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }}
        />
        <span style={{ color: '#f87171' }}>REC · {tc}</span>
      </div>

      {/* Top-right: camera id */}
      <div className="absolute top-5 right-6 text-right">ANSHU CUTS / 35MM · 24FPS</div>

      {/* Bottom-left: static exposure */}
      <div className="absolute bottom-5 left-6">f/2.8 · ISO 400</div>

      {/* Bottom-center: scene strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        SCENE 02 · TAKE 03 · <span style={{ color: '#ec4899' }}>{toolName.toUpperCase()}</span> · 24.000 FPS
      </div>
    </div>
  );
}

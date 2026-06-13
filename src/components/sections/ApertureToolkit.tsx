import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import ApertureIris from '../aperture/ApertureIris';
import ToolCardSwiper from '../aperture/ToolCardSwiper';
import CinemaHUD from '../aperture/CinemaHUD';
import FilmGrain from '../aperture/FilmGrain';
import { tools, DEFAULT_FOCUS_INDEX } from '../../lib/tools-data';

// Decorative bokeh dots scattered behind the cards for lens character.
const BOKEH = [
  { left: '12%', top: '28%', size: 90, color: 'rgba(236,72,153,0.20)' },
  { left: '80%', top: '22%', size: 70, color: 'rgba(167,139,250,0.18)' },
  { left: '20%', top: '70%', size: 60, color: 'rgba(125,211,252,0.16)' },
  { left: '72%', top: '72%', size: 110, color: 'rgba(255,255,255,0.07)' },
  { left: '50%', top: '85%', size: 50, color: 'rgba(110,231,183,0.16)' },
];

export default function ApertureToolkit() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Scroll choreography:
  //   0.20–0.45  iris opens
  //   0.45–0.58  iris fades away, swiper emerges
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const irisProgress = useTransform(
    scrollYProgress,
    reduced ? [0, 1] : [0.2, 0.45],
    reduced ? [1, 1] : [0, 1],
  );
  const irisOpacity = useTransform(
    scrollYProgress,
    reduced ? [0, 1] : [0.45, 0.58],
    reduced ? [0, 0] : [1, 0],
  );
  const irisScale = useTransform(
    scrollYProgress,
    reduced ? [0, 1] : [0.45, 0.58],
    reduced ? [1.3, 1.3] : [1, 1.3],
  );

  const [activeIndex, setActiveIndex] = useState(DEFAULT_FOCUS_INDEX);
  const [swiperRevealed, setSwiperRevealed] = useState<boolean>(!!reduced);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setSwiperRevealed(v >= 0.52);
  });

  const handleActiveChange = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <motion.section
      id="tech"
      ref={sectionRef}
      style={{
        opacity: sectionOpacity,
        background: 'radial-gradient(circle at 50% 45%, #0d0610 0%, #000000 75%)',
      }}
      className="relative w-full min-h-screen md:h-screen overflow-hidden flex flex-col items-center justify-center py-16 md:py-0 scroll-mt-24"
    >
      {/* Light bloom behind the aperture */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(167,139,250,0.10) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />

      {/* Bokeh dots */}
      {BOKEH.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: b.color,
            filter: 'blur(14px)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.7) 100%)' }}
        aria-hidden="true"
      />

      <CinemaHUD toolName={tools[activeIndex].name} />
      <FilmGrain />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 px-4">
        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-2">SELECT · LENS</p>
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">
            MY EDITING <span style={{ color: '#ec4899' }}>TOOLKIT</span>
          </h2>
        </div>

        {/* Stage: iris and swiper share the same spot — iris fades out, swiper fades in. */}
        <div className="relative flex items-center justify-center" style={{ minHeight: 320 }}>
          {/* Iris — opens then dissolves away */}
          <motion.div
            style={{ opacity: irisOpacity, scale: irisScale }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <ApertureIris progress={irisProgress} size={300} className="shrink-0" />
          </motion.div>

          {/* Swiper — emerges out of the open aperture */}
          <motion.div
            initial={false}
            animate={{
              opacity: swiperRevealed ? 1 : 0,
              scale: swiperRevealed ? 1 : 0.6,
              filter: swiperRevealed ? 'blur(0px)' : 'blur(10px)',
            }}
            transition={{ duration: reduced ? 0.1 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: swiperRevealed ? 'auto' : 'none' }}
            className="flex flex-col items-center gap-4"
          >
            <ToolCardSwiper
              tools={tools}
              onActiveChange={handleActiveChange}
              onSelect={(tool) => {
                // TODO: wire to project pages later.
                console.log('navigate to project:', tool.id, tool.name);
              }}
            />
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 flex items-center gap-2">
              <span aria-hidden="true">←</span> SWIPE TO RACK FOCUS <span aria-hidden="true">→</span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

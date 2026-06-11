import React, { useRef, useEffect, useCallback, useState } from 'react';

const ParticleLogo = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, isHovering: false });
  const isInitializedRef = useRef(false);
  const isScatteredRef = useRef(false);

  const teaseTimerRef = useRef(null);

  const [hasHovered, setHasHovered] = useState(false);
  const [timecode, setTimecode] = useState('00:00:00');
  const [isGlitching, setIsGlitching] = useState(false);
  const [chromaticOffset, setChromaticOffset] = useState({ rx: -1, ry: 0, cx: 1, cy: 0 });

  // --- Neon Scarlet Palette ---
  const SCARLET = { r: 255, g: 45, b: 85 };       // #FF2D55
  const SCARLET_GLOW = 'rgba(255, 84, 112, 0.55)'; // #FF5470
  const CYAN_PRIMARY = 'rgba(0, 217, 255, 0.35)';   // #00D9FF
  const CYAN_GLOW = 'rgba(94, 238, 255, 0.6)';      // #5EEEFF

  // --- Configuration ---
  const CANVAS_W = 64;
  const CANVAS_H = 46;
  const FONT_SIZE = 30;
  const SAMPLING_GAP = 1.8;
  const SCATTER_FORCE = 18;
  const SCATTER_RADIUS = 80;
  const RETURN_SPEED = 0.06;
  const FRICTION = 0.82;
  const PARTICLE_SIZE_MIN = 0.8;
  const PARTICLE_SIZE_MAX = 2.0;

  const TEASE_INTERVAL = 4000;
  const TEASE_PARTICLE_COUNT = 8;
  const TEASE_FORCE = 7;

  // --- Initialize particles ---
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitializedRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    offCtx.fillStyle = '#fff';
    offCtx.font = `700 ${FONT_SIZE * dpr}px "Inter", "Outfit", sans-serif`;
    offCtx.textBaseline = 'middle';
    offCtx.textAlign = 'center';
    offCtx.fillText('Fx', offscreen.width / 2, offscreen.height / 2);

    const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
    const pixels = imageData.data;
    const particles = [];
    const gap = Math.max(1, Math.round(SAMPLING_GAP * dpr));

    for (let y = 0; y < offscreen.height; y += gap) {
      for (let x = 0; x < offscreen.width; x += gap) {
        const index = (y * offscreen.width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 100) {
          particles.push({
            originX: x / dpr,
            originY: y / dpr,
            x: x / dpr,
            y: y / dpr,
            vx: 0,
            vy: 0,
            size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
            opacity: 0.5 + Math.random() * 0.5,
            scatterAngle: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    particlesRef.current = particles;
    isInitializedRef.current = true;
  }, []);

  // --- Animation loop ---
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInitializedRef.current) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const mouse = mouseRef.current;
    const particles = particlesRef.current;
    const isHovering = mouse.isHovering;

    if (isHovering && !isScatteredRef.current) {
      isScatteredRef.current = true;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = p.scatterAngle;
        const force = SCATTER_FORCE * (0.5 + Math.random() * 0.8);
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
      }
    }

    if (!isHovering) {
      isScatteredRef.current = false;
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (isHovering && canvasRect && containerRect) {
        const mouseCanvasX = mouse.x - (canvasRect.left - containerRect.left);
        const mouseCanvasY = mouse.y - (canvasRect.top - containerRect.top);

        const dx = p.x - mouseCanvasX;
        const dy = p.y - mouseCanvasY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SCATTER_RADIUS && dist > 0) {
          const force = ((SCATTER_RADIUS - dist) / SCATTER_RADIUS) * 2.5;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }

      const homeX = p.originX - p.x;
      const homeY = p.originY - p.y;
      p.vx += homeX * RETURN_SPEED;
      p.vy += homeY * RETURN_SPEED;

      p.vx *= FRICTION;
      p.vy *= FRICTION;

      p.x += p.vx;
      p.y += p.vy;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const glowIntensity = Math.min(speed / 4, 1);

      if (glowIntensity > 0.05) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 3 * glowIntensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${SCARLET.r}, ${SCARLET.g}, ${SCARLET.b}, ${0.2 * glowIntensity})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${SCARLET.r}, ${SCARLET.g}, ${SCARLET.b}, ${p.opacity})`;
      ctx.fill();
    }

    ctx.restore();
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // --- Mouse handlers ---
  const handleMouseEnter = useCallback(() => {
    mouseRef.current.isHovering = true;
    if (!hasHovered) setHasHovered(true);
  }, [hasHovered]);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.isHovering = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isHovering = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  // --- Lifecycle ---
  useEffect(() => {
    initParticles();
    animFrameRef.current = requestAnimationFrame(animate);

    // AUTO-SCATTER TEASE
    teaseTimerRef.current = setInterval(() => {
      if (!isInitializedRef.current) return;
      if (mouseRef.current.isHovering) return;

      const particles = particlesRef.current;
      if (particles.length === 0) return;

      const count = Math.min(TEASE_PARTICLE_COUNT, particles.length);
      const usedIndices = new Set();

      for (let i = 0; i < count; i++) {
        let idx;
        do {
          idx = Math.floor(Math.random() * particles.length);
        } while (usedIndices.has(idx));
        usedIndices.add(idx);

        const p = particles[idx];
        const angle = Math.random() * Math.PI * 2;
        p.vx += Math.cos(angle) * TEASE_FORCE;
        p.vy += Math.sin(angle) * TEASE_FORCE;
      }
    }, TEASE_INTERVAL);

    // TIMECODE COUNTER
    const startTime = Date.now();
    const timecodeInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      setTimecode(`${hrs}:${mins}:${secs}`);
    }, 1000);

    // CHROMATIC ABERRATION — smooth drift
    const chromaticInterval = setInterval(() => {
      const t = Date.now() / 1000;
      setChromaticOffset({
        rx: -1 + Math.sin(t * 0.8) * 1.2,
        ry: Math.cos(t * 0.6) * 0.5,
        cx: 1 + Math.cos(t * 0.8) * 1.2,
        cy: Math.sin(t * 0.6) * 0.5,
      });
    }, 50);

    // GLITCH SLICE — fires every ~7s
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    }, 7000);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (teaseTimerRef.current) clearInterval(teaseTimerRef.current);
      clearInterval(timecodeInterval);
      clearInterval(chromaticInterval);
      clearInterval(glitchInterval);
    };
  }, [initParticles, animate]);

  // --- Computed styles ---
  const chromaticTextShadow = `${chromaticOffset.rx}px ${chromaticOffset.ry}px 0px ${SCARLET_GLOW}, ${chromaticOffset.cx}px ${chromaticOffset.cy}px 0px ${CYAN_PRIMARY}`;

  const mainStyle = isGlitching
    ? { padding: '2px 4px', clipPath: 'inset(0 0 50% 0)', transform: 'translateX(4px) skewX(-2deg)' }
    : { padding: '2px 4px' };

  const glitchCloneStyle = isGlitching
    ? {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        clipPath: 'inset(50% 0 0 0)',
        transform: 'translateX(-4px) skewX(2deg)',
        pointerEvents: 'none',
        zIndex: 11,
      }
    : null;

  const glitchFlashStyle = isGlitching
    ? {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 45, 85, 0.08)',
        pointerEvents: 'none',
        zIndex: 12,
        mixBlendMode: 'screen',
      }
    : null;

  return (
    <div style={{ position: 'relative' }}>

      {/* Google Fonts: Orbitron for Divyansh wordmark */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        @keyframes logoPingRing {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; border-width: 2px; }
          70% { opacity: 0.3; border-width: 1px; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; border-width: 0.5px; }
        }
        @keyframes divyanshShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes divyanshPulse {
          0%,100% { letter-spacing: 0.08em; }
          50%      { letter-spacing: 0.12em; }
        }
        .divyansh-wordmark {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 20px;
          letter-spacing: 0.08em;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 35%,
            rgba(255,45,85,0.9) 50%,
            #ffffff 65%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation:
            divyanshShimmer 4s linear infinite,
            divyanshPulse   5s ease-in-out infinite;
          transition: filter 0.3s ease;
        }
        .divyansh-wordmark:hover {
          filter: drop-shadow(0 0 8px rgba(255,45,85,0.6));
        }
      `}</style>

      {/* === MAIN LOGO CONTAINER === */}
      <div
        ref={containerRef}
        className="relative z-10 flex items-center cursor-pointer select-none"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={mainStyle}
      >
        {/* "Divyansh" — Orbitron wordmark with shimmer animation */}
        <span
          className="divyansh-wordmark"
          style={{
            textShadow: 'none',
            position: 'relative',
          }}
        >
          Divyansh
        </span>

        {/* "Fx" — Kinetic particle canvas + ring pulse */}
        <div style={{ position: 'relative', display: 'inline-block', marginLeft: '-1px' }}>
          <canvas
            ref={canvasRef}
            style={{
              display: 'inline-block',
              position: 'relative',
              zIndex: 2,
              width: `${CANVAS_W}px`,
              height: `${CANVAS_H}px`,
              verticalAlign: 'middle',
            }}
          />

          {/* Ring pulses — scarlet primary */}
          {!hasHovered && (
            <>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '50px', height: '50px', borderRadius: '50%',
                border: '2px solid rgba(255, 45, 85, 0.6)',
                transform: 'translate(-50%, -50%) scale(0.3)',
                animation: 'logoPingRing 2.5s ease-out infinite',
                pointerEvents: 'none', zIndex: 1,
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '50px', height: '50px', borderRadius: '50%',
                border: '2px solid rgba(255, 45, 85, 0.4)',
                transform: 'translate(-50%, -50%) scale(0.3)',
                animation: 'logoPingRing 2.5s ease-out 1.2s infinite',
                pointerEvents: 'none', zIndex: 1,
              }} />
            </>
          )}
        </div>

        {/* TIMECODE COUNTER — cyan accent */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--cyan-primary)',
            opacity: 0.55,
            letterSpacing: '1.5px',
            marginLeft: '12px',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            position: 'relative',
            top: '1px',
          }}
        >
          {timecode}
        </span>
      </div>

      {/* === GLITCH CLONE (bottom half, only during glitch) === */}
      {glitchCloneStyle && (
        <div style={glitchCloneStyle} aria-hidden="true">
          <span
            className="divyansh-wordmark"
            style={{ textShadow: 'none' }}
          >
            Divyansh
          </span>
          <div style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px`, marginLeft: '-1px' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--cyan-primary)',
              opacity: 0.5,
              letterSpacing: '1.5px',
              marginLeft: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {timecode}
          </span>
        </div>
      )}

      {/* Red flash during glitch */}
      {glitchFlashStyle && <div style={glitchFlashStyle} />}
    </div>
  );
};

export default ParticleLogo;

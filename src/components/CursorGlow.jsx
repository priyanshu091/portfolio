import React, { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!glow || !dot || !ring) return;

    let isVisible = false;

    // Update positions instantly on mouse/touch event for zero-latency response
    const updateElements = (x, y, isHovering) => {
      // 1. Position the background ambient glow spotlight
      glow.style.setProperty('--mouse-x', `${x}px`);
      glow.style.setProperty('--mouse-y', `${y}px`);

      // 2. Translate the dot and ring parents instantly (0ms lag)
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // 3. Set CSS custom properties on parent so child elements animate transitions
      dot.style.setProperty('--dot-scale', isHovering ? '0.5' : '1');
      ring.style.setProperty('--ring-scale', isHovering ? '1.6' : '1');
      ring.style.setProperty('--ring-opacity', isHovering ? '0.8' : '0.4');
      ring.style.setProperty('--ring-glow-radius', isHovering ? '15px' : '8px');
      ring.style.setProperty('--ring-glow-opacity', isHovering ? '0.4' : '0.2');

      // 4. Reveal elements if they were hidden
      if (!isVisible) {
        isVisible = true;
        glow.style.opacity = '1';
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    // Desktop Mouse Event Handlers
    const handleMouseMove = (e) => {
      const target = e.target;
      const isHovering = !!(target && target.closest('a, button, [role="button"], .cursor-pointer, input, textarea, select, iframe, [onclick]'));
      updateElements(e.clientX, e.clientY, isHovering);
    };

    const handleMouseLeave = () => {
      isVisible = false;
      glow.style.opacity = '0';
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Mobile Touch Event Handlers
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateElements(touch.clientX, touch.clientY, false);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const target = touch.target;
        const isHovering = !!(target && target.closest('a, button, [role="button"], .cursor-pointer, input, textarea, select'));
        updateElements(touch.clientX, touch.clientY, isHovering);
      }
    };

    const handleTouchEnd = () => {
      isVisible = false;
      glow.style.opacity = '0';
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Bind Event Listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* 1. Global Ambient Spotlight Background Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-500 ease-out opacity-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(0, 217, 255, 0.09) 0%, rgba(255, 45, 85, 0.045) 45%, transparent 80%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* 2. Custom Pointer Follower - Dot Wrapper (Instant translation) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 z-[9999] transition-opacity duration-300 ease-out opacity-0"
        style={{
          margin: '-4px 0 0 -4px',
          willChange: 'transform',
        }}
      >
        {/* Dot Visual (Smooth scale transitions only) */}
        <div
          className="w-full h-full rounded-full transition-transform duration-200 ease-out"
          style={{
            backgroundColor: 'var(--cyan-primary)',
            boxShadow: '0 0 10px var(--cyan-glow)',
            transform: 'scale(var(--dot-scale, 1))',
          }}
        />
      </div>

      {/* 3. Custom Pointer Follower - Outer Ring Wrapper (Instant translation) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 z-[9999] transition-opacity duration-300 ease-out opacity-0"
        style={{
          margin: '-16px 0 0 -16px',
          willChange: 'transform',
        }}
      >
        {/* Ring Visual (Smooth scale, color and shadow transitions only) */}
        <div
          className="w-full h-full rounded-full border border-dashed transition-[transform,border-color,box-shadow] duration-200 ease-out"
          style={{
            borderColor: 'rgba(255, 45, 85, var(--ring-opacity, 0.4))',
            boxShadow: '0 0 var(--ring-glow-radius, 8px) rgba(255, 45, 85, var(--ring-glow-opacity, 0.2))',
            transform: 'scale(var(--ring-scale, 1))',
          }}
        />
      </div>
    </>
  );
};

export default CursorGlow;

import React, { useState, useRef, useEffect } from 'react';
import beforeThumb from '../assets/after-thumb.png';
import afterThumb from '../assets/before-thumb.png';

const BeforeAfterSlider = ({ isOpen, onClose }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger lazy loading and reset key on open
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationKey(prev => prev + 1);
    }
  }, [isOpen]);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleStart = () => {
    isDragging.current = true;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  // Click on the container jumps the slider to that position
  const handleContainerClick = (e) => {
    if (e.target.closest('.slider-handle')) return; // ignore click on the handle button itself
    handleMove(e.clientX);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] overflow-y-auto bg-black/95 backdrop-blur-md transition-all duration-500 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchEnd={handleEnd}
    >
      <style>{`
        @keyframes compareGlitch {
          0% { filter: hue-rotate(0deg) saturate(1); transform: scale(1); }
          10% { filter: hue-rotate(15deg) saturate(1.2); transform: scale(1.01) skewX(1deg); }
          15% { filter: hue-rotate(-10deg) saturate(1.4); transform: scale(0.99) skewX(-1deg); }
          20% { filter: hue-rotate(0deg) saturate(1); transform: scale(1); }
        }

        @keyframes compareLaser {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .compare-entry-glitch {
          animation: compareGlitch 0.4s ease-out forwards;
        }

        .compare-laser {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--scarlet-primary), #ffffff, var(--scarlet-primary), transparent);
          box-shadow: 0 0 15px var(--scarlet-primary), 0 0 30px var(--scarlet-primary);
          pointer-events: none;
          z-index: 40;
          animation: compareLaser 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* HUD style scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0"></div>

      {/* Centering wrapper with scroll-safe padding */}
      <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 md:py-20 z-10">
        {/* Main container */}
        <div 
          className={`relative w-full max-w-5xl mx-auto flex flex-col items-center transition-all duration-500 ease-out ${
            isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-12'
          }`}
        >
        
        {/* Header HUD panel */}
        <div className="w-full flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[var(--scarlet-primary)] rounded-full animate-ping"></span>
            <span className="text-[11px] uppercase tracking-[3px] font-bold text-white/90">
              THUMBNAIL COMPARISON PANEL
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 px-3 py-1.5 border border-white/15 hover:border-[var(--scarlet-primary)] bg-white/5 hover:bg-[var(--scarlet-primary)]/10 text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300"
            style={{ fontFamily: '"Courier New", monospace' }}
          >
            <span>CLOSE</span>
            <span className="transition-transform duration-300 group-hover:rotate-90">✕</span>
          </button>
        </div>

        {/* Info Text */}
        <div className="text-center mb-8 max-w-lg">
          <h3 className="text-white text-xl font-bold uppercase tracking-wider mb-2">
            Professional Thumbnail Overhaul
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Drag the center bar left and right to compare the amateur "Before" concept with the final scroll-stopping "After" design.
          </p>
        </div>

        {/* Draggable Slider Wrapper */}
        <div 
          key={animationKey}
          ref={containerRef}
          className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl select-none cursor-ew-resize compare-entry-glitch"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={(e) => { handleStart(); handleMove(e.clientX); }}
          onTouchStart={(e) => { handleStart(); if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX); }}
          onClick={handleContainerClick}
        >
          {/* Holographic Entry Laser Scanline */}
          {isOpen && <div className="compare-laser"></div>}
          {/* AFTER Image (Bottom layer) */}
          <img 
            src={afterThumb} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          {/* After HUD label (bottom right) */}
          <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-[2px] backdrop-blur-sm pointer-events-none">
            AFTER // PROFESSIONAL
          </div>

          {/* BEFORE Image (Top layer, clipped via clipPath) */}
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={beforeThumb} 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            />
            {/* Before HUD label (bottom left) */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-[var(--scarlet-primary)]/10 border border-[var(--scarlet-primary)]/40 text-[var(--scarlet-primary)] text-[10px] font-black uppercase tracking-[2px] backdrop-blur-sm pointer-events-none">
              BEFORE // AMATEUR
            </div>
          </div>

          {/* Drag Handle Divider Line */}
          <div 
            className="absolute top-0 bottom-0 z-30 w-[2px] bg-white cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Pulsing glow line */}
            <div className="absolute inset-0 -left-1 -right-1 bg-white/20 blur-[2px]"></div>

            {/* Centered drag handle button */}
            <div 
              className="slider-handle absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-white bg-black/95 flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 pointer-events-auto"
              onMouseDown={(e) => { e.stopPropagation(); handleStart(); }}
              onTouchStart={(e) => { e.stopPropagation(); handleStart(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 17 3 12 8 7" />
                <polyline points="16 7 21 12 16 17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer info/controls */}
        <div className="w-full flex justify-between items-center mt-6 text-[10px] tracking-[2px] text-white/40 uppercase" style={{ fontFamily: '"Courier New", monospace' }}>
          <span>DRAG DIVISION HANDLE</span>
          <span>SYSTEM_READY_V1.7</span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;

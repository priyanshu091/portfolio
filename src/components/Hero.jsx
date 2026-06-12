import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import heroOverlayImg from '../assets/hero-video/hero-image/hero.png';
import BeforeAfterSlider from './BeforeAfterSlider';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const circleRef = useRef(null);
  const bgTextRef = useRef(null);
  const topLayerRef = useRef(null);
  
  // Cinematic Reveal Refs
  const revealCanvasRef = useRef(null);
  const revealMaskCanvasRef = useRef(null);
  const heroOverlayObj = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });

  // Stats Counting Refs
  const viewsRef = useRef(null);
  const projectsRef = useRef(null);
  const timeRef = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  // 1. Preload Images objects
  const imagesRef = useRef([]);
  // Track current frame to avoid redundant renders
  const currentFrameRef = useRef({ index: 0 });

  // 1. Preload Frames
  useEffect(() => {
    const frameCount = 240;
    let loadedCount = 0;
    const images = new Array(frameCount);

    for (let i = 1; i <= frameCount; i++) {
      const num = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `/hero-video/ezgif-frame-${num}.webp`;
      
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      
      // In case an image fails to load, we still increment so we don't get stuck indefinitely
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };

      // Keep them strictly ordered
      images[i - 1] = img;
    }
    
    imagesRef.current = images;

    // Preload the overlay image and create off-screen mask canvas
    const overlayImg = new Image();
    overlayImg.src = heroOverlayImg;
    overlayImg.onload = () => { heroOverlayObj.current = overlayImg; };
    revealMaskCanvasRef.current = document.createElement('canvas');
  }, []);

  // 2. Canvas Rendering Logic
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d', { alpha: false });
    const img = imagesRef.current[index];
    
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear previous frame
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Scale image to fill full screen width
    const scale = canvasWidth / img.width;
    const x = 0; // Align to left edge
    const y = (canvasHeight / 2) - (img.height / 2) * scale; // Center vertically

    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // High-DPI Retina Support
    const dpr = window.devicePixelRatio || 1;
    const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    const parentHeight = canvas.parentElement?.clientHeight || window.innerHeight;
    
    canvas.width = parentWidth * dpr;
    canvas.height = parentHeight * dpr;
    
    if (revealCanvasRef.current) {
      revealCanvasRef.current.width = parentWidth * dpr;
      revealCanvasRef.current.height = parentHeight * dpr;
    }
    if (revealMaskCanvasRef.current) {
      revealMaskCanvasRef.current.width = parentWidth * dpr;
      revealMaskCanvasRef.current.height = parentHeight * dpr;
      // Pre-fill mask with black so it starts fully hidden
      const maskCtx = revealMaskCanvasRef.current.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, parentWidth * dpr, parentHeight * dpr);
      }
    }
    
    renderFrame(currentFrameRef.current.index);
  };

  // 3. GSAP Scroll Animation
  useGSAP(() => {
    // Lock scroll during preloader
    if (!preloaderComplete) {
      document.body.style.overflow = 'hidden';
    }

    if (!isLoaded) return;
    
    // Cinematic Preloader Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setPreloaderComplete(true);
        document.body.style.overflow = '';
      }
    });

    tl.to('.preloader-panel', {
      yPercent: 100,
      duration: 1.8,
      stagger: 0.12,
      ease: 'power4.inOut'
    });

    // Initial Render & Resize Listener
    handleResize();
    window.addEventListener('resize', handleResize);

    const frameCount = 240;

    // Canvas Image Sequence Scrub (Completes at 75% progress)
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth premium scrub
      onUpdate: (self) => {
        // Map 0 -> 0.75 progress to 0 -> 239 frame index
        let frameIndex;
        if (self.progress <= 0.75) {
          frameIndex = Math.floor((self.progress / 0.75) * (frameCount - 1));
        } else {
          frameIndex = frameCount - 1;
        }
        
        // requestAnimationFrame prevents unnecessary re-renders
        if (frameIndex !== currentFrameRef.current.index) {
          currentFrameRef.current.index = frameIndex;
          requestAnimationFrame(() => renderFrame(frameIndex));
        }
      }
    });

    // Text entrance blur timeline scrubbed in the remaining 25% scroll progress
    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth premium scrub matching canvas
      }
    });

    // 75% of timeline duration is empty spacer
    textTimeline.to({}, { duration: 3 });

    // Staggered reveal animations in the final 25%
    textTimeline.fromTo('.hero-title-tag', 
      { opacity: 0, y: 30, filter: 'blur(15px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'none' }
    )
    .fromTo('.hero-title-line', 
      { opacity: 0, y: 50, filter: 'blur(30px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.2, ease: 'none' },
      '-=0.2'
    )
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 40, filter: 'blur(15px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'none' },
      '-=0.3'
    );

    // High-performance scroll-scrubbed numbers animation
    const statsObj = { views: 0, projects: 0, time: 0 };
    textTimeline.fromTo('.hero-cta', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.45, ease: 'none' },
      '-=0.3'
    )
    .to(statsObj, {
      views: 10,
      projects: 150,
      time: 48,
      duration: 0.5,
      ease: 'none',
      onUpdate: () => {
        if (viewsRef.current) viewsRef.current.innerText = Math.floor(statsObj.views);
        if (projectsRef.current) projectsRef.current.innerText = Math.floor(statsObj.projects);
        if (timeRef.current) timeRef.current.innerText = Math.floor(statsObj.time);
      }
    }, '-=0.45');

    // Subtle Canvas Zoom Effect
    gsap.to(canvasRef.current, {
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Circle scale-in animation on page load
    gsap.fromTo(circleRef.current, 
      { scale: 0.9 },
      { scale: 1, duration: 1.2, ease: 'power3.out' }
    );

    // --- CINEMATIC LIGHT REVEAL LOOP ---
    const renderReveal = () => {
      if (!revealCanvasRef.current || !revealMaskCanvasRef.current || !heroOverlayObj.current) return;
      
      const canvas = revealCanvasRef.current;
      const maskCanvas = revealMaskCanvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: true });
      const maskCtx = maskCanvas.getContext('2d', { alpha: true });
      
      const w = canvas.width;
      const h = canvas.height;
      
      if (!ctx || !maskCtx || w === 0 || h === 0) return;

      // Only active during frames 235-240
      if (currentFrameRef.current.index < 235) {
        if (mouseRef.current.isActive) {
          ctx.clearRect(0, 0, w, h);
          maskCtx.globalCompositeOperation = 'source-over';
          maskCtx.fillStyle = 'black';
          maskCtx.fillRect(0, 0, w, h);
          mouseRef.current.isActive = false;
        }
        return;
      }

      mouseRef.current.isActive = true;
      
      const { x, y } = mouseRef.current;
      const isMouseActive = x >= 0 && y >= 0;

      // 1. Fade the mask back to black (hide the image) — fast fade when mouse is away
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = isMouseActive ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.15)';
      maskCtx.fillRect(0, 0, w, h);
      
      // 2. Draw brush stroke to reveal image only where mouse is hovering
      if (isMouseActive) {
        maskCtx.globalCompositeOperation = 'destination-out';
        const radius = 250; // Soft brush size
        const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(x, y, radius, 0, Math.PI * 2);
        maskCtx.fill();
      }
      
      // 3. Render final frame
      ctx.clearRect(0, 0, w, h);
      
      // Draw the overlay image
      const img = heroOverlayObj.current;
      const scale = w / img.width;
      const imgY = (h / 2) - (img.height / 2) * scale;
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, imgY, img.width * scale, img.height * scale);
      
      // Apply the mask (hides everything except where mouse revealed)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(maskCanvas, 0, 0);
    };

    gsap.ticker.add(renderReveal);

    const handleMouseMove = (e) => {
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current.x = e.clientX * dpr;
      mouseRef.current.y = e.clientY * dpr;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const stickyViewport = containerRef.current.querySelector('.sticky');
    if (stickyViewport) {
      stickyViewport.addEventListener('mousemove', handleMouseMove);
      stickyViewport.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      gsap.ticker.remove(renderReveal);
      ScrollTrigger.getAll().forEach(st => st.kill(true));
      gsap.killTweensOf(canvasRef.current);
      if (stickyViewport) {
        stickyViewport.removeEventListener('mousemove', handleMouseMove);
        stickyViewport.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, { scope: containerRef, dependencies: [isLoaded] });

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full pt-[90px]" style={{ backgroundColor: 'var(--bg-deep)' }}>
      
      {/* Premium GSAP 6-Panel Preloader */}
      {!preloaderComplete && (
        <div className="fixed inset-0 z-[200] flex w-full h-screen pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="preloader-panel h-full border-r"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', width: '16.666667%' }}
            />
          ))}
          {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center text-white z-10 text-sm font-medium tracking-widest uppercase opacity-50">
               {loadingProgress}%
             </div>
          )}
        </div>
      )}

      {/* Sticky Viewport */}
      <div 
        className="sticky top-[90px] h-[calc(100vh-90px)] w-full overflow-hidden"
      >
        
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover origin-center"
        />

        {/* Cinematic Reveal Canvas */}
        <canvas
          ref={revealCanvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none z-[2] hidden md:block"
        />

        {/* Creative Bold Background Text (Second Layer) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
          <h1 
            ref={bgTextRef}
            className="text-[18vw] font-black tracking-tighter opacity-0 whitespace-nowrap"
            style={{ color: 'var(--scarlet-primary)', fontFamily: 'var(--font-heading)' }}
          >
            CREATIVE
          </h1>
        </div>

        {/* Top Layer Cutout Image */}
        <img 
          ref={topLayerRef}
          src="/hero-video/ezgif-frame-240.webp" 
          className="absolute inset-0 h-full w-full object-cover origin-center pointer-events-none z-[2] opacity-0"
          alt="Top Layer Cutout"
        />

        {/* HUD Ring Design Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
          <div 
            ref={circleRef}
            className="relative flex items-center justify-center"
          >
            {/* Outer dashed ring (spins slowly) */}
            <div className="absolute rounded-full h-[400px] w-[400px] md:h-[650px] md:w-[650px] animate-[spin_60s_linear_infinite]" style={{ border: '1px dashed rgba(255, 45, 85, 0.3)' }}></div>
            {/* Inner solid ring */}
            <div className="absolute rounded-full h-[360px] w-[360px] md:h-[600px] md:w-[600px]" style={{ border: '1px solid rgba(255, 45, 85, 0.6)', boxShadow: '0 0 30px rgba(255, 45, 85, 0.1) inset' }}></div>
            {/* Inner dotted tech ring */}
            <div className="absolute rounded-full h-[320px] w-[320px] md:h-[550px] md:w-[550px]" style={{ border: '1px dotted rgba(0, 217, 255, 0.3)' }}></div>
            
            {/* Crosshairs */}
            <div className="absolute w-[1px] h-[420px] md:h-[680px]" style={{ backgroundColor: 'rgba(255, 45, 85, 0.15)' }}></div>
            <div className="absolute h-[1px] w-[420px] md:w-[680px]" style={{ backgroundColor: 'rgba(255, 45, 85, 0.15)' }}></div>
            
            {/* Dots on inner ring */}
            <div className="absolute top-0 w-2 h-2 rounded-full -translate-y-[180px] md:-translate-y-[300px]" style={{ backgroundColor: 'var(--cyan-primary)' }}></div>
            <div className="absolute bottom-0 w-2 h-2 rounded-full translate-y-[180px] md:translate-y-[300px]" style={{ backgroundColor: 'var(--cyan-primary)' }}></div>
            <div className="absolute left-0 w-2 h-2 rounded-full -translate-x-[180px] md:-translate-x-[300px]" style={{ backgroundColor: 'var(--cyan-primary)' }}></div>
            <div className="absolute right-0 w-2 h-2 rounded-full translate-x-[180px] md:translate-x-[300px]" style={{ backgroundColor: 'var(--cyan-primary)' }}></div>
          </div>
        </div>

        {/* NEW FINAL SCROLL CONTENT OVERLAY */}
        <div className="absolute inset-0 z-[10] pointer-events-auto overflow-hidden">
          
          {/* LEFT SIDEBAR: Socials */}
          <div className="hidden sm:flex absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex-col gap-8">
            {/* Instagram */}
            <a href="https://www.instagram.com/its_divyansh.x/" target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-110 transform" style={{ color: '#E1306C' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.3)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/919369097211" target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-110 transform" style={{ color: '#25D366' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.3)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/divyansh-vishwakarma-9a84533a8/" target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-110 transform" style={{ color: '#0A66C2' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.3)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>

          {/* MAIN CONTENT (Left Aligned) */}
          <div className="absolute left-8 sm:left-24 md:left-32 top-1/2 -translate-y-1/2 max-w-xl pr-4 mt-8">
            
            {/* Tag */}
            <div className="hero-title-tag opacity-0 flex items-center gap-3 mb-6" style={{ color: 'var(--cyan-primary)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              <span className="text-[11px] uppercase tracking-[3px] font-bold">VIDEO EDITOR</span>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </div>

            {/* Headline */}
            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="block hero-title-line opacity-0">WE TURN</span>
              <span className="block hero-title-line opacity-0">FOOTAGE</span>
              <span className="block hero-title-line opacity-0">INTO <span style={{ color: 'var(--scarlet-primary)' }}>IMPACT.</span></span>
            </h2>

            {/* Subtext */}
            <p className="hero-subtitle opacity-0 text-[16px] md:text-[18px] leading-[1.5] max-w-sm md:max-w-md mb-12" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              Cinematic edits, powerful storytelling and content that keeps your audience hooked.
            </p>

            {/* Stats */}
            <div className="hero-cta opacity-0 flex items-center gap-8 md:gap-12 mb-12">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--scarlet-primary)' }}>
                  <span ref={viewsRef}>0</span>M+
                </div>
                <div className="text-[9px] uppercase tracking-[1.5px]" style={{ color: 'var(--text-muted)' }}>VIEWS GENERATED</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--scarlet-primary)' }}>
                  <span ref={projectsRef}>0</span>+
                </div>
                <div className="text-[9px] uppercase tracking-[1.5px]" style={{ color: 'var(--text-muted)' }}>PROJECTS DONE</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--scarlet-primary)' }}>
                  <span ref={timeRef}>0</span>HR
                </div>
                <div className="text-[9px] uppercase tracking-[1.5px]" style={{ color: 'var(--text-muted)' }}>TURNAROUND TIME</div>
              </div>
            </div>

            {/* Premium Techie Button */}
            <style>{`
              @keyframes btnScanLine {
                0% { transform: translateY(-100%); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(400%); opacity: 0; }
              }
              @keyframes btnAuroraBlob1 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(10px, -6px) scale(1.12); }
              }
              @keyframes btnAuroraBlob2 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(-8px, 8px) scale(0.88); }
              }
              @keyframes btnCornerPulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
              .tech-btn:hover .btn-liquid { transform: translateY(0%) !important; }
              .tech-btn:hover .btn-sweep { left: 120% !important; opacity: 1 !important; }
              .tech-btn:hover .btn-aurora1 { animation-play-state: running !important; }
              .tech-btn:hover .btn-aurora2 { animation-play-state: running !important; }
              .tech-btn:hover .btn-border-glow { opacity: 1 !important; }
              .tech-btn:hover .btn-corner { opacity: 1 !important; border-color: var(--scarlet-primary) !important; }
              .tech-btn:hover .btn-label { color: #ffffff !important; text-shadow: 0 0 12px var(--scarlet-glow); }
              .tech-btn:hover .btn-arrow { transform: translate(3px, -3px); }
              .tech-btn:hover { border-color: rgba(255,45,85,0.6) !important; box-shadow: 0 0 25px rgba(255,45,85,0.2), inset 0 0 25px rgba(255,45,85,0.04) !important; }
            `}</style>

            <div className="hero-cta opacity-0 flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
              {/* Button 1: VIEW OUR WORK */}
              <a
                href="#work"
                className="tech-btn relative inline-flex items-center justify-center px-10 py-4 overflow-hidden cursor-pointer"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(13,13,13,0.6)',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                  minWidth: '220px',
                }}
              >
                {/* Liquid Aurora Fill — rises from bottom on hover */}
                <div
                  className="btn-liquid absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ transform: 'translateY(100%)', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {/* Deep liquid base */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,45,85,0.12)' }} />

                  {/* Aurora Blob 1 — Purple */}
                  <div
                    className="btn-aurora1 absolute -top-1/2 -left-1/4 w-[200%] h-[200%] rounded-full mix-blend-screen"
                    style={{
                      background: 'radial-gradient(circle, rgba(217,152,255,0.25) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      opacity: 0.6,
                      animation: 'btnAuroraBlob1 7s ease-in-out infinite',
                      animationPlayState: 'paused',
                    }}
                  />

                  {/* Aurora Blob 2 — Cyan */}
                  <div
                    className="btn-aurora2 absolute -bottom-1/2 -right-1/4 w-[200%] h-[200%] rounded-full mix-blend-screen"
                    style={{
                      background: 'radial-gradient(circle, rgba(0,217,255,0.2) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      opacity: 0.5,
                      animation: 'btnAuroraBlob2 10s ease-in-out infinite',
                      animationPlayState: 'paused',
                    }}
                  />

                  {/* Scarlet glow bloom at center */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,45,85,0.2) 0%, transparent 70%)',
                    }}
                  />
                </div>

                {/* Horizontal Sweep Orb — slides across on hover */}
                <div
                  className="btn-sweep absolute top-0 bottom-0 w-[60px] mix-blend-screen pointer-events-none"
                  style={{
                    left: '-80%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.5), transparent)',
                    filter: 'blur(8px)',
                    opacity: 0,
                    transition: 'left 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s',
                  }}
                />

                {/* Border Glow overlay */}
                <div
                  className="btn-border-glow absolute inset-0 pointer-events-none opacity-0"
                  style={{
                    boxShadow: 'inset 0 0 16px rgba(255,45,85,0.15)',
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Scan Line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute left-0 right-0 h-[1px]"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.6), transparent)',
                      animation: 'btnScanLine 2.5s ease-in-out infinite',
                    }}
                  />
                </div>

                {/* Corner Tech Brackets */}
                {/* Top-left */}
                <span className="btn-corner absolute top-1 left-1 w-3 h-3 border-t border-l opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Top-right */}
                <span className="btn-corner absolute top-1 right-1 w-3 h-3 border-t border-r opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Bottom-left */}
                <span className="btn-corner absolute bottom-1 left-1 w-3 h-3 border-b border-l opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Bottom-right */}
                <span className="btn-corner absolute bottom-1 right-1 w-3 h-3 border-b border-r opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />

                {/* Status dot */}
                <span
                  className="relative z-10 mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--scarlet-primary)',
                    boxShadow: '0 0 6px var(--scarlet-primary)',
                    animation: 'btnCornerPulse 2s ease-in-out infinite',
                  }}
                />

                {/* Label */}
                <span
                  className="btn-label relative z-10 text-[11px] font-bold uppercase tracking-[3px] mr-4 transition-all duration-300"
                  style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-heading)' }}
                >
                  VIEW OUR WORK
                </span>

                {/* Animated arrow */}
                <span
                  className="btn-arrow relative z-10 text-[18px] transition-transform duration-500"
                  style={{ color: 'var(--scarlet-primary)', lineHeight: 1 }}
                >
                  ↗
                </span>
              </a>

              {/* Button 2: BOOK SERVICES */}
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('bookServices'));
                }}
                className="tech-btn relative inline-flex items-center justify-center px-10 py-4 overflow-hidden cursor-pointer"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(13,13,13,0.6)',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                  minWidth: '220px',
                }}
              >
                {/* Liquid Aurora Fill — rises from bottom on hover */}
                <div
                  className="btn-liquid absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ transform: 'translateY(100%)', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {/* Deep liquid base */}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,45,85,0.12)' }} />

                  {/* Aurora Blob 1 — Purple */}
                  <div
                    className="btn-aurora1 absolute -top-1/2 -left-1/4 w-[200%] h-[200%] rounded-full mix-blend-screen"
                    style={{
                      background: 'radial-gradient(circle, rgba(217,152,255,0.25) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      opacity: 0.6,
                      animation: 'btnAuroraBlob1 7s ease-in-out infinite',
                      animationPlayState: 'paused',
                    }}
                  />

                  {/* Aurora Blob 2 — Cyan */}
                  <div
                    className="btn-aurora2 absolute -bottom-1/2 -right-1/4 w-[200%] h-[200%] rounded-full mix-blend-screen"
                    style={{
                      background: 'radial-gradient(circle, rgba(0,217,255,0.2) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      opacity: 0.5,
                      animation: 'btnAuroraBlob2 10s ease-in-out infinite',
                      animationPlayState: 'paused',
                    }}
                  />

                  {/* Scarlet glow bloom at center */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,45,85,0.2) 0%, transparent 70%)',
                    }}
                  />
                </div>

                {/* Horizontal Sweep Orb — slides across on hover */}
                <div
                  className="btn-sweep absolute top-0 bottom-0 w-[60px] mix-blend-screen pointer-events-none"
                  style={{
                    left: '-80%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.5), transparent)',
                    filter: 'blur(8px)',
                    opacity: 0,
                    transition: 'left 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s',
                  }}
                />

                {/* Border Glow overlay */}
                <div
                  className="btn-border-glow absolute inset-0 pointer-events-none opacity-0"
                  style={{
                    boxShadow: 'inset 0 0 16px rgba(255,45,85,0.15)',
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Scan Line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute left-0 right-0 h-[1px]"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,45,85,0.6), transparent)',
                      animation: 'btnScanLine 2.5s ease-in-out infinite',
                    }}
                  />
                </div>

                {/* Corner Tech Brackets */}
                {/* Top-left */}
                <span className="btn-corner absolute top-1 left-1 w-3 h-3 border-t border-l opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Top-right */}
                <span className="btn-corner absolute top-1 right-1 w-3 h-3 border-t border-r opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Bottom-left */}
                <span className="btn-corner absolute bottom-1 left-1 w-3 h-3 border-b border-l opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                {/* Bottom-right */}
                <span className="btn-corner absolute bottom-1 right-1 w-3 h-3 border-b border-r opacity-40 transition-all duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />

                {/* Status dot */}
                <span
                  className="relative z-10 mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--scarlet-primary)',
                    boxShadow: '0 0 6px var(--scarlet-primary)',
                    animation: 'btnCornerPulse 2s ease-in-out infinite',
                  }}
                />

                {/* Label */}
                <span
                  className="btn-label relative z-10 text-[11px] font-bold uppercase tracking-[3px] mr-4 transition-all duration-300"
                  style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-heading)' }}
                >
                  BOOK SERVICES
                </span>

                {/* Animated arrow */}
                <span
                  className="btn-arrow relative z-10 text-[18px] transition-transform duration-500"
                  style={{ color: 'var(--scarlet-primary)', lineHeight: 1 }}
                >
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Tech Elements */}
          <div className="hidden xl:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col items-end gap-32 mt-8">
            
            {/* Timecode Block */}
            <div className="flex flex-col items-end gap-2 border border-dashed p-3 rounded-sm opacity-60" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'rgba(13, 13, 13, 0.3)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
                00:01:30:00
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
                FRAME 0248
              </div>
            </div>

            {/* Compare/Reveal Graphic */}
            <div 
              onClick={() => setIsCompareOpen(true)}
              className="relative flex items-center justify-center w-28 h-28 rounded-full border border-dashed cursor-pointer group" 
              style={{ borderColor: 'var(--border-default)' }} 
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--scarlet-primary)'} 
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
            >
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-125" style={{ backgroundColor: 'var(--scarlet-dark)', opacity: 0.1, filter: 'blur(15px)' }}></div>
              {/* Inner circle */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                {/* Compare split slider icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--scarlet-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                  <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
                  <circle cx="12" cy="12" r="3" fill="var(--scarlet-primary)" />
                  <path d="M18 8l4 4-4 4" />
                  <path d="M6 16l-4-4 4-4" />
                </svg>
              </div>
              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 opacity-50" style={{ borderColor: 'var(--text-muted)' }}></div>
              <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 opacity-50" style={{ borderColor: 'var(--text-muted)' }}></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 opacity-50" style={{ borderColor: 'var(--text-muted)' }}></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 opacity-50" style={{ borderColor: 'var(--text-muted)' }}></div>
              
              <div className="absolute -bottom-8 text-[9px] uppercase tracking-[4px]" style={{ color: 'var(--text-muted)' }}>COMPARE</div>
            </div>

          </div>

          {/* BOTTOM CENTER: Cyberpunk Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
            
            <style>{`
              @keyframes cyberScrollTrack {
                0% { transform: translateY(-100%); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(300%); opacity: 0; }
              }
              @keyframes cyberChevron {
                0%, 100% { opacity: 0.1; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(2px); }
              }
            `}</style>

            {/* Glowing Vertical Track */}
            <div className="w-[2px] h-10 relative overflow-hidden mb-2" style={{ backgroundColor: 'var(--border-subtle)' }}>
              <div 
                className="absolute top-0 left-0 w-full h-1/3" 
                style={{ 
                  backgroundColor: 'var(--scarlet-primary)', 
                  boxShadow: '0 0 10px var(--scarlet-primary)',
                  animation: 'cyberScrollTrack 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
              ></div>
            </div>

            {/* Animated Chevrons */}
            <div className="flex flex-col items-center -space-y-1 mb-2">
              <div className="w-2.5 h-2.5 border-r-[2px] border-b-[2px] rotate-45" style={{ borderColor: 'var(--scarlet-primary)', animation: 'cyberChevron 1.5s ease-in-out infinite' }}></div>
              <div className="w-2.5 h-2.5 border-r-[2px] border-b-[2px] rotate-45" style={{ borderColor: 'var(--scarlet-primary)', animation: 'cyberChevron 1.5s ease-in-out 0.15s infinite' }}></div>
              <div className="w-2.5 h-2.5 border-r-[2px] border-b-[2px] rotate-45" style={{ borderColor: 'var(--scarlet-primary)', animation: 'cyberChevron 1.5s ease-in-out 0.3s infinite' }}></div>
            </div>

            <span className="text-[9px] uppercase tracking-[3px] font-bold transition-colors duration-300 group-hover:text-white" style={{ color: 'var(--scarlet-primary)' }}>
              SCROLL LINK
            </span>
          </div>

        </div>

      </div>
      <BeforeAfterSlider isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </section>
  );
};

export default Hero;
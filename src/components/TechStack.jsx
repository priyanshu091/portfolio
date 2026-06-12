import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  {
    id: 'aftereffects',
    name: 'AFTER EFFECTS',
    category: 'VFX & COMPOSITING',
    desc: 'Advanced motion tracking, rotoscoping, and 2.5D animation.',
    orbitRadius: 140,
    speed: 25,
    startAngle: 0,
    color: '#D998FF',
    icon: <span className="font-bold text-2xl tracking-tighter" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Ae</span>
  },
  {
    id: 'premiere',
    name: 'PREMIERE PRO',
    category: 'VIDEO EDITING',
    desc: 'Primary NLE for assembly, pacing, and multi-cam storytelling.',
    orbitRadius: 200,
    speed: 35,
    startAngle: 72,
    color: '#0055FF',
    icon: <span className="font-bold text-2xl tracking-tighter" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Pr</span>
  },
  {
    id: 'photoshop',
    name: 'PHOTOSHOP',
    category: 'ASSET DESIGN',
    desc: 'Custom thumbnail creation, rotobrush masking, and plates.',
    orbitRadius: 240,
    speed: 45,
    startAngle: 144,
    color: '#00D9FF',
    icon: <span className="font-bold text-2xl tracking-tighter" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Ps</span>
  },
  {
    id: 'capcut',
    name: 'CAPCUT',
    category: 'SHORT FORM',
    desc: 'Rapid workflow for reels, auto-captions, and trending effects.',
    orbitRadius: 290,
    speed: 55,
    startAngle: 216,
    color: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7">
        <path d="M109.095 181.505c2.223-19.532 18.316-34.578 37.955-35.483l167.194-.001a40.612 40.612 0 0 1 30.095 17.427 42.152 42.152 0 0 1 6.39 14.915l49.135-24.364a2.185 2.185 0 0 1 3.141 1.674v27.628l.001.096a4.571 4.571 0 0 1-2.837 4.229 177620.936 177620.936 0 0 0-135.63 67.336l135.324 66.948a4.695 4.695 0 0 1 3.142 4.08v27.685a2.266 2.266 0 0 1-3.613 1.821c-16.12-8.162-32.464-15.854-48.462-24.18a63.503 63.503 0 0 1-4.282 11.225 40.813 40.813 0 0 1-26.098 20.135 44.994 44.994 0 0 1-11.221.919l-155.833.003c-3.51 0-7.04 0-10.53-.266-18.089-2.705-32.049-17.363-33.869-35.565v-26.77a5.935 5.935 0 0 1 4.08-4.879c27.791-13.732 55.521-27.587 83.353-41.258a32412.61 32412.61 0 0 0-84.17-41.748 5.41 5.41 0 0 1-3.223-4.918c-.042-8.876-.185-17.792-.042-26.689zm30.975.184c-1.674 3.367-.898 7.263-1.041 10.896 30.608 15.12 60.99 30.321 91.536 45.339 30.185-14.963 60.384-29.927 90.596-44.89 0-2.714.123-5.428 0-8.162a10.203 10.203 0 0 0-10.096-8.734h-.106l-161.565.001a10.082 10.082 0 0 0-9.345 5.55h.021zm-1.041 135.406c.142 3.673-.654 7.631 1.122 11.039a10.204 10.204 0 0 0 9.284 5.405l161.667.002.081-.001c3.618 0 6.961-1.94 8.754-5.081 2.04-3.57 1.102-7.855 1.305-11.773-30.26-14.936-60.48-30.118-90.801-44.89a43915.126 43915.126 0 0 0-91.432 45.299h.02z" />
      </svg>
    )
  },
  {
    id: 'filmora',
    name: 'FILMORA',
    category: 'QUICK EDITS',
    desc: 'Efficient drag-and-drop workflow for fast turnaround projects.',
    orbitRadius: 200,
    speed: 35,
    startAngle: 288,
    color: '#00FF9D',
    icon: (
      <svg viewBox="0 0 122.88 122.88" className="w-7 h-7">
        <path fill="#ffffff" d="M46,55.24,29.32,38.55,49.94,17.91,70.55,38.54,46.92,62.21l-.11-.12A5.58,5.58,0,0,0,46,55.24Z"/>
        <polygon fill="#00FF9D" points="93.58 61.27 49.92 104.97 29.3 84.34 72.96 40.63 93.58 61.27 93.58 61.27"/>
      </svg>
    )
  }
];

const TechStack = () => {
  const [hoveredTool, setHoveredTool] = useState(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    // Set full text immediately — no letter-by-letter typing
    if (headingRef.current) {
      headingRef.current.innerHTML = `MY EDITING <br/><span style="color: var(--scarlet-primary)">TOOLKIT.</span>`;
    }
    if (descRef.current) {
      descRef.current.innerHTML = `The same apps used by top creators and studios — now working for you.<span class="block mt-4 text-[11px] opacity-40 tracking-wider" style="color: var(--text-secondary); text-transform: none;">Tap or hover to explore each tool.</span>`;
    }

    // Simple fade-in + slide-up when section enters viewport (no pin, no scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',  // Trigger when top of section hits 80% of viewport
        once: true,         // Play only once, don't reverse
      }
    });

    // Start hidden
    gsap.set([headingRef.current, descRef.current], { opacity: 0, y: 40 });

    // Animate in together with slight stagger
    tl.to(headingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to(descRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5');  // overlap with heading animation for smoother feel

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill(true);
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill(true));
    };
  }, []);

  return (
    <section 
      id="tech" 
      ref={containerRef}
      className="relative w-full min-h-fit overflow-hidden flex items-center justify-center py-12 md:py-16 scroll-mt-24"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }}
      />

      <div className="container mx-auto px-8 md:px-16 relative z-10 flex flex-col lg:flex-row items-center justify-between h-full">
        
        {/* LEFT: Text & HUD Panel */}
        <div className="w-full lg:w-1/3 z-20 pointer-events-none mb-8 lg:mb-0">
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--cyan-primary)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              <span className="text-[11px] uppercase tracking-[3px] font-bold">WORKFLOW</span>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </div>
            <h2 
              ref={headingRef}
              className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.1] mb-4" 
              style={{ fontFamily: 'var(--font-heading)' }}
            />
            <p 
              ref={descRef}
              className="text-[16px] leading-[1.5] max-w-sm" 
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Dynamic HUD Panel based on hover */}
          <div className={`relative p-4 border transition-all duration-500 overflow-hidden ${hoveredTool ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
               style={{ 
                 borderColor: hoveredTool ? hoveredTool.color : 'var(--border-subtle)',
                 backgroundColor: 'rgba(31, 31, 31, 0.6)',
                 backdropFilter: 'blur(10px)'
               }}>
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

            {hoveredTool && (
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[2px]" style={{ color: hoveredTool.color }}>{hoveredTool.category}</span>
                  <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>ACTIVE</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-widest">{hoveredTool.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {hoveredTool.desc}
                </p>
                <div className="mt-2 w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${hoveredTool.color}, transparent)` }}></div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Holographic Orbit System */}
        <div className="w-full lg:w-2/3 flex items-center justify-center relative h-[450px] lg:h-[600px]">
          
          {/* Inject Keyframes for orbit */}
          <style>{`
            @keyframes orbitRotation {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes counterRotation {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes auroraMove1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(12px, -8px) scale(1.1); }
            }
            @keyframes auroraMove2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-8px, 12px) scale(0.9); }
            }
            @keyframes auroraMove3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(6px, -6px) scale(1.15); }
            }
            @keyframes particlePulse {
              0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
            }
          `}</style>

          {/* Central Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
            {/* Core Glow */}
            <div className="absolute w-32 h-32 rounded-full opacity-20 blur-xl" style={{ backgroundColor: 'var(--cyan-primary)' }}></div>
            {/* Core physical */}
            <div className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center bg-[#0d0d0d]" style={{ borderColor: 'var(--cyan-primary)', boxShadow: '0 0 20px rgba(0, 217, 255, 0.3) inset' }}>
               <div className="w-16 h-16 rounded-full border border-dashed animate-[spin_10s_linear_infinite]" style={{ borderColor: 'var(--cyan-primary)' }}></div>
               <div className="absolute font-black tracking-widest text-[12px] uppercase" style={{ color: 'var(--cyan-primary)' }}>CORE</div>
            </div>
          </div>

          {/* PASS 1: Orbit ring visuals + orbiting particles */}
          {tools.map((tool) => {
            const isPaused = hoveredTool !== null;
            const isHovered = hoveredTool?.id === tool.id;
            const ringSize = tool.orbitRadius * 2;
            // Generate 3 particles at different angles for each ring
            const particles = [0, 120, 240].map((offsetAngle, i) => {
              const angle = (offsetAngle * Math.PI) / 180;
              const px = tool.orbitRadius + Math.cos(angle) * tool.orbitRadius;
              const py = tool.orbitRadius + Math.sin(angle) * tool.orbitRadius;
              return { px, py, delay: i * 1.2, size: i === 0 ? 4 : 3 };
            });
            return (
              <div key={`ring-${tool.id}`}>
                {/* Main visible ring — solid subtle border */}
                <div
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    width: `${ringSize}px`,
                    height: `${ringSize}px`,
                    border: `1px solid ${isHovered ? tool.color + '60' : 'rgba(255,255,255,0.12)'}`,
                    animation: `orbitRotation ${tool.speed}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    opacity: isPaused && !isHovered ? 0.3 : 1,
                    zIndex: isHovered ? 25 : 10,
                  }}
                />
                {/* Glow ring — blurred duplicate for outer glow effect */}
                <div
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    width: `${ringSize}px`,
                    height: `${ringSize}px`,
                    border: `1px solid ${isHovered ? tool.color + '30' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isHovered 
                      ? `0 0 15px ${tool.color}20, inset 0 0 15px ${tool.color}10`
                      : '0 0 8px rgba(255,255,255,0.03), inset 0 0 8px rgba(255,255,255,0.02)',
                    animation: `orbitRotation ${tool.speed}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    opacity: isPaused && !isHovered ? 0.2 : 1,
                    zIndex: isHovered ? 24 : 9,
                    filter: 'blur(1px)',
                  }}
                />
                {/* Orbiting particles — small glowing dots on the ring path */}
                {particles.map((p, pIdx) => (
                  <div
                    key={`particle-${tool.id}-${pIdx}`}
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      width: `${ringSize}px`,
                      height: `${ringSize}px`,
                      animation: `orbitRotation ${tool.speed * (0.7 + pIdx * 0.2)}s linear infinite`,
                      animationPlayState: isPaused ? 'paused' : 'running',
                      opacity: isPaused && !isHovered ? 0.2 : 1,
                      zIndex: isHovered ? 26 : 11,
                    }}
                  >
                    <div
                      className="absolute rounded-full"
                      style={{
                        left: `${p.px}px`,
                        top: `${p.py}px`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: isHovered ? tool.color : 'rgba(255,255,255,0.5)',
                        boxShadow: isHovered 
                          ? `0 0 8px ${tool.color}, 0 0 16px ${tool.color}60`
                          : '0 0 6px rgba(255,255,255,0.3), 0 0 12px rgba(255,255,255,0.15)',
                        animation: `particlePulse ${2 + pIdx * 0.5}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          })}

          {/* PASS 2: Satellites — rendered after all rings so they always sit on top */}
          {tools.map((tool) => {
            const isPaused = hoveredTool !== null;
            const isHovered = hoveredTool?.id === tool.id;
            // Calculate initial satellite position on ring edge using trig
            const angleRad = (tool.startAngle * Math.PI) / 180 - Math.PI / 2;
            const satX = tool.orbitRadius + Math.cos(angleRad) * tool.orbitRadius;
            const satY = tool.orbitRadius + Math.sin(angleRad) * tool.orbitRadius;
            return (
              // Satellite carrier: same size/animation as the ring so it follows the same orbit path
              <div
                key={`sat-${tool.id}`}
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: `${tool.orbitRadius * 2}px`,
                  height: `${tool.orbitRadius * 2}px`,
                  animation: `orbitRotation ${tool.speed}s linear infinite`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                  zIndex: isHovered ? 35 : 20,
                }}
              >
                {/* Satellite icon node — trig-positioned on ring edge */}
                <div
                  className="absolute pointer-events-auto cursor-pointer group flex items-center justify-center"
                  style={{
                    left: `${satX}px`,
                    top: `${satY}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredTool(tool)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  {/* Counter-rotation wrapper — keeps icon upright as carrier rotates */}
                  <div
                    style={{
                      animation: `counterRotation ${tool.speed}s linear infinite`,
                      animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                  >
                    <div
                      className="relative w-16 h-16 rounded-[1.05rem] flex items-center justify-center pointer-events-auto cursor-pointer"
                      style={{
                        backgroundColor: isHovered ? 'rgba(10, 10, 15, 0.55)' : 'rgba(20, 20, 20, 0.25)',
                        backdropFilter: isHovered ? 'blur(20px)' : 'blur(14px)',
                        border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                        boxShadow: isHovered
                          ? `0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${tool.color}35, inset 0 0 12px rgba(255, 255, 255, 0.05)`
                          : `0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.02)`,
                        color: tool.color,
                        transform: isHovered ? 'scale(1.12) translateY(-3px)' : 'scale(1)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Aurora Glow Underlay */}
                      <div className="absolute inset-[1px] overflow-hidden rounded-[0.95rem] pointer-events-none z-0">
                        <div
                          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                          style={{
                            opacity: isHovered ? 0.25 : 0.8,
                            background: `radial-gradient(circle at 50% 120%, ${tool.color}15, transparent 75%)`,
                          }}
                        />
                        {/* Aurora Blob Layer 1 */}
                        <div
                          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full mix-blend-screen filter blur-[18px] opacity-35 animate-[auroraMove1_8s_ease-in-out_infinite]"
                          style={{
                            background: 'radial-gradient(circle, rgba(217, 152, 255, 0.3) 0%, transparent 80%)',
                            animationPlayState: isHovered ? 'running' : 'paused',
                          }}
                        />
                        {/* Aurora Blob Layer 2 */}
                        <div
                          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full mix-blend-screen filter blur-[18px] opacity-35 animate-[auroraMove2_10s_ease-in-out_infinite]"
                          style={{
                            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, transparent 80%)',
                            animationPlayState: isHovered ? 'running' : 'paused',
                          }}
                        />
                        {/* Aurora Blob Layer 3 */}
                        <div
                          className="absolute top-1/4 left-1/4 w-[85%] h-[85%] rounded-full mix-blend-screen filter blur-[14px] opacity-30 animate-[auroraMove3_12s_ease-in-out_infinite]"
                          style={{
                            background: 'radial-gradient(circle, rgba(255, 45, 85, 0.25) 0%, transparent 80%)',
                            animationPlayState: isHovered ? 'running' : 'paused',
                          }}
                        />
                        {/* Hover Swipe Glowing Orb */}
                        <div
                          className="absolute top-0 bottom-0 w-[45px] mix-blend-screen filter blur-[12px] transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            left: isHovered ? '130%' : '-90%',
                            background: `linear-gradient(90deg, transparent, ${tool.color}66, transparent)`,
                            opacity: isHovered ? 1 : 0,
                          }}
                        />
                        {/* Overlaid Highlight Bloom */}
                        <div
                          className="absolute inset-0 transition-opacity duration-700 ease-out"
                          style={{
                            opacity: isHovered ? 0.3 : 0,
                            background: `radial-gradient(circle at center, ${tool.color}30, transparent 65%)`,
                          }}
                        />
                      </div>
                      {/* Inner Glass Reflection */}
                      <div
                        className="absolute inset-[3px] rounded-xl pointer-events-none z-20"
                        style={{
                          border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'}`,
                          background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)`,
                        }}
                      />
                      {/* Icon */}
                      <div className="relative z-10" style={{ filter: `drop-shadow(0 0 8px ${tool.color})` }}>
                        {tool.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default TechStack;

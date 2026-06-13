import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const projects = [
  { 
    id: 'doc', 
    title: 'DOCUMENTARY & FACT STYLE', 
    tag: 'DEEP DIVE', 
    gridClasses: 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
    color: '#FF2D55', // Using hex for ThreeJS
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4'
  },
  { 
    id: 'reels', 
    title: 'PODCAST REELS', 
    tag: 'SHORT FORM', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-2',
    color: '#00D9FF',
    videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/BBROs.mp4'
  },
  { 
    id: 'comm', 
    title: 'COMMERCIAL & BRAND', 
    tag: 'ADVERTISING', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#FFFFFF',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4'
  },
  { 
    id: 'beat', 
    title: 'BEAT SYNC & TRAVEL', 
    tag: 'DYNAMIC', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#FF5470',
    videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/GARTANGGALI4.mp4'
  },
  { 
    id: 'long', 
    title: 'LONG FORMAT PODCAST', 
    tag: 'RETENTION', 
    gridClasses: 'col-span-1 md:col-span-2 row-span-1 md:row-span-1',
    color: '#00D9FF',
    videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/BBROs.mp4'
  },
  { 
    id: 'ai', 
    title: 'AI & STOCK MEDIA', 
    tag: 'GENERATIVE', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#00D9FF',
    videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/aijaguar.mp4'
  },
  { 
    id: 'wed', 
    title: 'WEDDING & EVENT', 
    tag: 'CINEMATIC', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#FF2D55',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'motion', 
    title: 'MOTION GRAPHICS', 
    tag: 'ANIMATION', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#D998FF',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4'
  },
  { 
    id: 'real-estate', 
    title: 'PROPERTY & REAL ESTATE', 
    tag: 'ARCHITECTURE', 
    gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
    color: '#00FF9D',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
  }
];

const shootedVideos = [
  { id: 'shoot-1', title: 'ICELAND VOLCANIC ERUPTION', tag: 'TRAVEL // CINEMATIC', color: '#FF2D55', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' },
  { id: 'shoot-2', title: 'ROADSIDE STORIES: TOKYO', tag: 'STREET // COLD STYLE', color: '#00D9FF', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' },
  { id: 'shoot-3', title: 'CHASING LIGHT: AMSTERDAM', tag: 'TRAVEL // ARCHIVE', color: '#FFFFFF', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
  { id: 'shoot-4', title: 'CYBERPUNK NEON RIDE', tag: 'CREATIVE // SHOTOVER', color: '#FF5470', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/GARTANGGALI4.mp4' },
  { id: 'shoot-5', title: 'AESTHETIC FITNESS PROMO', tag: 'SPORTS // SPEC AD', color: '#00D9FF', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
  { id: 'shoot-6', title: 'MOUNTAIN SUMMIT RETREAT', tag: 'CINEMATIC // DRONE', color: '#FF2D55', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' }
];

const graphicDesigns = [
  { id: 'design-1', title: 'CINEMATIC KEY ART POSTER', tag: 'POSTER // KEY ART', color: '#FFCC00', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
  { id: 'design-2', title: 'YOUTUBE THUMBNAIL SUITE', tag: 'THUMBNAIL // RETENTION', color: '#00D9FF', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop' },
  { id: 'design-3', title: 'GAMING STREAM OVERLAY PACK', tag: 'UI // STREAMING', color: '#FF2D55', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop' },
  { id: 'design-4', title: 'BRAND VISUAL IDENTITY SYSTEM', tag: 'BRANDING // IDENTITY', color: '#00FF9D', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop' },
  { id: 'design-5', title: 'MATTE PAINTING & CONCEPT ART', tag: 'CONCEPT // VFX', color: '#D998FF', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop' },
  { id: 'design-6', title: 'SOCIAL MEDIA MARKETING KIT', tag: 'PROMOTION // AD', color: '#FF5470', imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop' }
];

const BackgroundMedia = ({ videoUrl, imageUrl }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500">
      {visible && videoUrl && (
        <video
          src={`${videoUrl}#t=0.1`}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
        />
      )}
      {visible && !videoUrl && imageUrl && (
        <img src={imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
      )}
    </div>
  );
};

const Work = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState('edited'); // 'edited' | 'shooted' | 'graphics'
  const [hoveredTab, setHoveredTab] = useState(null); // 'edited' | 'shooted' | 'graphics' | null
  const [displayedTab, setDisplayedTab] = useState('edited');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [domainThumbnails, setDomainThumbnails] = useState({});
  const [cmsFullProduction, setCmsFullProduction] = useState([]);
  const [cmsGraphicDesign, setCmsGraphicDesign] = useState([]);
  const [customSectionCards, setCustomSectionCards] = useState([]); // custom "Edited Videos" sections as cards
  const [customFullProdSections, setCustomFullProdSections] = useState([]); // custom Full Production section cards
  const [customGraphicSections, setCustomGraphicSections] = useState([]); // custom Graphic Designing section cards

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(result => {
        if (result && result.domainThumbnails) {
          setDomainThumbnails(result.domainThumbnails);
        }
        // Extract CMS videos for Full Production & Graphic Designing tabs
        if (result && result.videos) {
          setCmsFullProduction(
            result.videos
              .filter(v => v.section === 'full-production')
              .map(v => ({ id: v.id, title: v.title, tag: v.tag, color: '#FF2D55', videoUrl: v.videoUrl, imageUrl: v.thumbnailUrl || null }))
          );
          setCmsGraphicDesign(
            result.videos
              .filter(v => v.section === 'graphic-design')
              .map(v => ({ id: v.id, title: v.title, tag: v.tag, color: '#FFCC00', videoUrl: v.videoUrl, imageUrl: v.thumbnailUrl || null }))
          );
        }
        // Build cards from custom sections (added via admin)
        if (result && result.customSections) {
          const editedCards = result.customSections
            .filter(s => s.group === 'Edited Videos')
            .map(s => ({
              id: s.id,
              title: s.label.toUpperCase(),
              tag: s.group.toUpperCase(),
              gridClasses: 'col-span-1 md:col-span-1 row-span-1 md:row-span-1',
              color: s.color,
              imageUrl: result.domainThumbnails?.[s.id] || null,
            }));
          setCustomSectionCards(editedCards);

          // Custom Full Production sub-sections → render as cards in Full Production tab
          const fullProdCards = result.customSections
            .filter(s => s.group === 'Full Production')
            .flatMap(s => {
              const sectionVideos = (result.videos || [])
                .filter(v => v.section === s.id)
                .map(v => ({ id: v.id, title: v.title, tag: v.tag, color: s.color, videoUrl: v.videoUrl, imageUrl: v.thumbnailUrl || null }));
              return sectionVideos;
            });
          setCustomFullProdSections(fullProdCards);

          // Custom Graphic Designing sub-sections → render as cards in Graphics tab
          const graphicCards = result.customSections
            .filter(s => s.group === 'Graphic Designing')
            .flatMap(s => {
              const sectionVideos = (result.videos || [])
                .filter(v => v.section === s.id)
                .map(v => ({ id: v.id, title: v.title, tag: v.tag, color: s.color, videoUrl: v.videoUrl, imageUrl: v.thumbnailUrl || null }));
              return sectionVideos;
            });
          setCustomGraphicSections(graphicCards);
        }
      })
      .catch(err => console.error('Failed to fetch CMS data:', err));
  }, []);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab || isTransitioning) return;
    setIsTransitioning(true);

    // Highlight switcher immediately
    setActiveTab(newTab);

    // Snell exit fadeout (150ms)
    setTimeout(() => {
      setDisplayedTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  // Helper to render the appropriate 3D model
  const render3DModel = (type, color, isHovered) => {
    switch(type) {
      case 'doc': return <DocModel color={color} hovered={isHovered} />;
      case 'reels': return <ReelsModel color={color} hovered={isHovered} />;
      case 'comm': return <CommModel color={color} hovered={isHovered} />;
      case 'beat': return <BeatModel color={color} hovered={isHovered} />;
      case 'long': return <LongModel color={color} hovered={isHovered} />;
      case 'ai': return <AiModel color={color} hovered={isHovered} />;
      case 'wed': return <WedModel color={color} hovered={isHovered} />;
      default: return null;
    }
  };

  return (
    <section 
      id="work" 
      className="relative w-full py-12 md:py-16 overflow-hidden scroll-mt-24"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      <style>{`
        @keyframes cardExit {
          0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.97); filter: blur(2px); }
        }
        @keyframes cardEntry {
          0% { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .card-exit {
          animation: cardExit 0.15s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .card-entry {
          animation: cardEntry 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      <div className="w-full px-8 md:px-16">
        
        {/* Dynamic Title Block based on Tab */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--cyan-primary)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <span className="text-[11px] uppercase tracking-[3px] font-bold">SELECT WORKS</span>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.1] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {activeTab === 'edited' ? (
              <>CHOOSE YOUR EDITING <span style={{ color: 'var(--scarlet-primary)' }}>JOURNEY</span></>
            ) : activeTab === 'shooted' ? (
              <>FULL <span style={{ color: 'var(--scarlet-primary)' }}>PRODUCTION</span></>
            ) : (
              <>CREATIVE GRAPHIC <span style={{ color: 'var(--scarlet-primary)' }}>DESIGNS</span></>
            )}
          </h2>
          <p className="text-[16px] leading-[1.5] max-w-lg" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            {activeTab === 'edited' ? (
              "We edit across a wide range of formats. Click on a category below to explore our work and find the style that fits your project."
            ) : activeTab === 'shooted' ? (
              "Explore a collection of visual stories and cinematic works shot entirely by us."
            ) : (
              "High-impact visuals, key art, thumbnails, and brand assets designed to command attention."
            )}
          </p>
        </div>

        {/* HUD Tab Switcher Bar with 3D Perspective */}
        <div className="flex justify-center mb-8">
          <div 
            className="inline-flex flex-wrap md:flex-nowrap p-1 rounded-2xl md:rounded-full border backdrop-blur-md transition-all duration-500 ease-out gap-2 md:gap-3 justify-center" 
            style={{ 
              backgroundColor: 'rgba(13,13,13,0.6)', 
              borderColor: 'var(--border-subtle)',
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            <button 
              onClick={() => handleTabChange('edited')}
              onMouseEnter={() => setHoveredTab('edited')}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ease-out"
              style={{ 
                color: activeTab === 'edited' ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: activeTab === 'edited' ? 'var(--bg-elevated)' : 'transparent',
                borderColor: activeTab === 'edited' 
                  ? 'var(--scarlet-primary)' 
                  : (hoveredTab === 'edited' ? 'rgba(255,255,255,0.15)' : 'transparent'),
                borderWidth: '1px',
                borderStyle: 'solid',
                transform: hoveredTab === 'edited'
                  ? 'translateY(-5px) translateZ(15px) scale(1.05)'
                  : (activeTab === 'edited' ? 'translateY(0) translateZ(5px) scale(1)' : 'translateY(0) translateZ(0) scale(1)'),
                boxShadow: activeTab === 'edited'
                  ? (hoveredTab === 'edited' 
                      ? '0 12px 30px rgba(255, 45, 85, 0.4), inset 0 0 10px rgba(255, 45, 85, 0.2)' 
                      : '0 6px 20px rgba(255, 45, 85, 0.2), inset 0 0 8px rgba(255, 45, 85, 0.1)')
                  : (hoveredTab === 'edited' ? '0 8px 20px rgba(255,255,255,0.08)' : 'none'),
                textShadow: activeTab === 'edited' ? '0 0 8px var(--scarlet-glow)' : 'none',
                zIndex: activeTab === 'edited' ? 10 : 1
              }}
            >
              Edited Videos
            </button>
            <button 
              onClick={() => handleTabChange('shooted')}
              onMouseEnter={() => setHoveredTab('shooted')}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ease-out"
              style={{ 
                color: activeTab === 'shooted' ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: activeTab === 'shooted' ? 'var(--bg-elevated)' : 'transparent',
                borderColor: activeTab === 'shooted' 
                  ? 'var(--scarlet-primary)' 
                  : (hoveredTab === 'shooted' ? 'rgba(255,255,255,0.15)' : 'transparent'),
                borderWidth: '1px',
                borderStyle: 'solid',
                transform: hoveredTab === 'shooted'
                  ? 'translateY(-5px) translateZ(15px) scale(1.05)'
                  : (activeTab === 'shooted' ? 'translateY(0) translateZ(5px) scale(1)' : 'translateY(0) translateZ(0) scale(1)'),
                boxShadow: activeTab === 'shooted'
                  ? (hoveredTab === 'shooted' 
                      ? '0 12px 30px rgba(255, 45, 85, 0.4), inset 0 0 10px rgba(255, 45, 85, 0.2)' 
                      : '0 6px 20px rgba(255, 45, 85, 0.2), inset 0 0 8px rgba(255, 45, 85, 0.1)')
                  : (hoveredTab === 'shooted' ? '0 8px 20px rgba(255,255,255,0.08)' : 'none'),
                textShadow: activeTab === 'shooted' ? '0 0 8px var(--scarlet-glow)' : 'none',
                zIndex: activeTab === 'shooted' ? 10 : 1
              }}
            >
              Full Production
            </button>
            <button 
              onClick={() => handleTabChange('graphics')}
              onMouseEnter={() => setHoveredTab('graphics')}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ease-out"
              style={{ 
                color: activeTab === 'graphics' ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: activeTab === 'graphics' ? 'var(--bg-elevated)' : 'transparent',
                borderColor: activeTab === 'graphics' 
                  ? 'var(--scarlet-primary)' 
                  : (hoveredTab === 'graphics' ? 'rgba(255,255,255,0.15)' : 'transparent'),
                borderWidth: '1px',
                borderStyle: 'solid',
                transform: hoveredTab === 'graphics'
                  ? 'translateY(-5px) translateZ(15px) scale(1.05)'
                  : (activeTab === 'graphics' ? 'translateY(0) translateZ(5px) scale(1)' : 'translateY(0) translateZ(0) scale(1)'),
                boxShadow: activeTab === 'graphics'
                  ? (hoveredTab === 'graphics' 
                      ? '0 12px 30px rgba(255, 45, 85, 0.4), inset 0 0 10px rgba(255, 45, 85, 0.2)' 
                      : '0 6px 20px rgba(255, 45, 85, 0.2), inset 0 0 8px rgba(255, 45, 85, 0.1)')
                  : (hoveredTab === 'graphics' ? '0 8px 20px rgba(255,255,255,0.08)' : 'none'),
                textShadow: activeTab === 'graphics' ? '0 0 8px var(--scarlet-glow)' : 'none',
                zIndex: activeTab === 'graphics' ? 10 : 1
              }}
            >
              Graphic Designing
            </button>
          </div>
        </div>

        {/* Content Render based on selected Tab with transition effects */}
        <div className="relative w-full">

          {displayedTab === 'edited' ? (
            /* GRID FOR EDITED VIDEOS (matching the own shooted videos styling) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              {[...projects, ...customSectionCards].map((project, i) => {
                const customThumb = domainThumbnails[project.id];
                const displayVideo = customThumb ? null : project.videoUrl;
                const displayImage = customThumb || project.imageUrl;
                return (
                  <div 
                    key={project.id}
                    className={`group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                      isTransitioning ? 'card-exit' : 'card-entry'
                    }`}
                    style={{ 
                      borderColor: 'var(--border-subtle)', 
                      backgroundColor: 'var(--bg-surface)',
                      animationDelay: isTransitioning ? '0s' : `${i * 0.08}s`
                    }}
                    onClick={() => navigate(`/work/${project.id}`)}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.borderColor = project.color; 
                      e.currentTarget.style.boxShadow = `0 15px 40px ${project.color}22`; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
                      e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; 
                    }}
                  >
                    {/* Grainy Noise Background */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
                    
                    {/* Dynamic neon blur spotlight background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-85">
                      <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: project.color }}></div>
                    </div>

                    {/* Thumbnail / Video Preview */}
                    <BackgroundMedia videoUrl={displayVideo} imageUrl={displayImage} />

                  {/* Central Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-25">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: 'rgba(13,13,13,0.4)', borderColor: project.color }}
                    >
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[11px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.3)] to-transparent opacity-90 z-10 flex flex-col justify-end p-6 pointer-events-none">
                    <span className="inline-block self-start px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border backdrop-blur-sm mb-2" style={{ color: project.color, borderColor: project.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                      {project.tag}
                    </span>
                    <span className="text-white text-md font-bold uppercase tracking-widest">{project.title}</span>
                    <span className="text-[9px] uppercase tracking-[2px] mt-1" style={{ color: 'var(--text-muted)' }}>ENTER ARCHIVE ↗</span>
                  </div>
                </div>
              );
            })}
              


            </div>
          ) : displayedTab === 'shooted' ? (
            /* VIDEO GRID GALLERY FOR OWN SHOOTED VIDEOS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              {[...cmsFullProduction, ...customFullProdSections, ...shootedVideos].map((video, i) => (
                <div 
                  key={video.id}
                  className={`group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    isTransitioning ? 'card-exit' : 'card-entry'
                  }`}
                  style={{ 
                    borderColor: 'var(--border-subtle)', 
                    backgroundColor: 'var(--bg-surface)',
                    animationDelay: isTransitioning ? '0s' : `${i * 0.08}s`
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.borderColor = video.color; 
                    e.currentTarget.style.boxShadow = `0 15px 40px ${video.color}22`; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
                    e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; 
                  }}
                >
                  {/* Grainy Noise Background */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
                  
                  {/* Dynamic neon blur spotlight background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-85">
                    <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: video.color }}></div>
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <BackgroundMedia videoUrl={video.videoUrl} imageUrl={video.imageUrl} />

                  {/* Central Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-25">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: 'rgba(13,13,13,0.4)', borderColor: video.color }}
                    >
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[11px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.3)] to-transparent opacity-90 z-10 flex flex-col justify-end p-6 pointer-events-none">
                    <span className="inline-block self-start px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border backdrop-blur-sm mb-2" style={{ color: video.color, borderColor: video.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                      {video.tag}
                    </span>
                    <span className="text-white text-md font-bold uppercase tracking-widest">{video.title}</span>
                    <span className="text-[9px] uppercase tracking-[2px] mt-1" style={{ color: 'var(--text-muted)' }}>4K // RAW FOOTAGE</span>
                  </div>
                </div>
              ))}
              
              {/* Contact / Start a Conversation Card */}
              <div 
                className={`group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center ${
                  isTransitioning ? 'card-exit' : 'card-entry'
                }`}
                style={{ 
                  borderColor: 'var(--border-subtle)', 
                  backgroundColor: 'var(--bg-surface)',
                  animationDelay: isTransitioning ? '0s' : `${[...cmsFullProduction, ...customFullProdSections, ...shootedVideos].length * 0.08}s`
                }}
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--scarlet-primary)'; 
                  e.currentTarget.style.boxShadow = `0 15px 40px rgba(255,45,85,0.15)`; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
                  e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; 
                }}
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 opacity-80"></div>
                
                <div className="z-10 w-16 h-16 rounded-full border border-dashed border-[var(--text-muted)] group-hover:border-[var(--scarlet-primary)] flex items-center justify-center mb-4 transition-colors duration-500 bg-black/30 backdrop-blur-sm group-hover:bg-[rgba(255,45,85,0.05)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-secondary)] group-hover:text-[var(--scarlet-primary)] transition-colors duration-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                
                <span className="z-10 text-white text-md font-bold uppercase tracking-widest text-center">Start a<br/>Conversation</span>
                <span className="z-10 text-[9px] uppercase tracking-[2px] mt-3" style={{ color: 'var(--text-muted)' }}>LET'S WORK TOGETHER ↗</span>
              </div>

            </div>
          ) : (
            /* GRAPHIC DESIGN GRID GALLERY */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              {[...cmsGraphicDesign, ...customGraphicSections, ...graphicDesigns].map((design, i) => (
                <div 
                  key={design.id}
                  className={`group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    isTransitioning ? 'card-exit' : 'card-entry'
                  }`}
                  style={{ 
                    borderColor: 'var(--border-subtle)', 
                    backgroundColor: 'var(--bg-surface)',
                    animationDelay: isTransitioning ? '0s' : `${i * 0.08}s`
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.borderColor = design.color; 
                    e.currentTarget.style.boxShadow = `0 15px 40px ${design.color}22`; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
                    e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; 
                  }}
                >
                  {/* Grainy Noise Background */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
                  
                  {/* Dynamic neon blur spotlight background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-85">
                    <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: design.color }}></div>
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <BackgroundMedia videoUrl={design.videoUrl} imageUrl={design.imageUrl} />

                  {/* Central Eye/View Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-25">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: 'rgba(13,13,13,0.4)', borderColor: design.color }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.3)] to-transparent opacity-90 z-10 flex flex-col justify-end p-6 pointer-events-none">
                    <span className="inline-block self-start px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border backdrop-blur-sm mb-2" style={{ color: design.color, borderColor: design.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                      {design.tag}
                    </span>
                    <span className="text-white text-md font-bold uppercase tracking-widest">{design.title}</span>
                    <span className="text-[9px] uppercase tracking-[2px] mt-1" style={{ color: 'var(--text-muted)' }}>VIEW DESIGN ↗</span>
                  </div>
                </div>
              ))}
              
              {/* Contact / Start a Conversation Card */}
              <div 
                className={`group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center ${
                  isTransitioning ? 'card-exit' : 'card-entry'
                }`}
                style={{ 
                  borderColor: 'var(--border-subtle)', 
                  backgroundColor: 'var(--bg-surface)',
                  animationDelay: isTransitioning ? '0s' : `${[...cmsGraphicDesign, ...customGraphicSections, ...graphicDesigns].length * 0.08}s`
                }}
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--scarlet-primary)'; 
                  e.currentTarget.style.boxShadow = `0 15px 40px rgba(255,45,85,0.15)`; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
                  e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; 
                }}
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 opacity-80"></div>
                
                <div className="z-10 w-16 h-16 rounded-full border border-dashed border-[var(--text-muted)] group-hover:border-[var(--scarlet-primary)] flex items-center justify-center mb-4 transition-colors duration-500 bg-black/30 backdrop-blur-sm group-hover:bg-[rgba(255,45,85,0.05)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-secondary)] group-hover:text-[var(--scarlet-primary)] transition-colors duration-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                
                <span className="z-10 text-white text-md font-bold uppercase tracking-widest text-center">Start a<br/>Conversation</span>
                <span className="z-10 text-[9px] uppercase tracking-[2px] mt-3" style={{ color: 'var(--text-muted)' }}>LET'S WORK TOGETHER ↗</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Work;

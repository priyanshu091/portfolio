import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const domainData = {
  doc: { 
    title: 'DOCUMENTARY & FACT STYLE', 
    tag: 'LONG FORM', 
    color: 'var(--scarlet-primary)',
    projects: [
      { id: 'doc-1', title: 'THE SILENT ALPS', tag: 'NATURE DOCUMENTARY', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
      { id: 'doc-2', title: 'METROPOLIS LIFE', tag: 'URBAN EXPLORATION', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' },
      { id: 'doc-3', title: 'BEYOND THE STARS', tag: 'SPACE SCIENCE', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' }
    ]
  },
  reels: { 
    title: 'PODCAST REELS', 
    tag: 'SHORT FORM', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'reels-1', title: 'TRS PODCAST SHORTS', tag: 'PODCAST REEL', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/BBROs.mp4' },
      { id: 'reels-2', title: '3 RULES OF FOCUS', tag: 'MOTIVATION REEL', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
      { id: 'reels-3', title: 'WHY AI WILL CHANGE WORK', tag: 'TECH REEL', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' }
    ]
  },
  comm: { 
    title: 'COMMERCIAL & BRAND', 
    tag: 'ADVERTISING', 
    color: '#FFFFFF',
    projects: [
      { id: 'comm-1', title: 'NEO-RUN RUNNING SHOES', tag: 'SPEC AD', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' },
      { id: 'comm-2', title: 'AURA WATCH COMPANY', tag: 'BRAND FILM', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' }
    ]
  },
  beat: { 
    title: 'BEAT SYNC & TRAVEL', 
    tag: 'DYNAMIC', 
    color: 'var(--scarlet-glow)',
    projects: [
      { id: 'beat-1', title: 'GARTANG GALI EXPEDITION', tag: 'TRAVEL SYNC', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/GARTANGGALI4.mp4' },
      { id: 'beat-2', title: 'NEON STREETS TOKYO', tag: 'BEAT SYNC', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' }
    ]
  },
  long: { 
    title: 'LONG FORMAT PODCAST', 
    tag: 'RETENTION', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'long-1', title: 'THE BEERBICEPS SHOW', tag: 'FULL EPISODE', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/BBROs.mp4' },
      { id: 'long-2', title: 'THE FUTURE OF WORKPLACE', tag: 'DISCUSSION', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' }
    ]
  },
  ai: { 
    title: 'AI & STOCK MEDIA', 
    tag: 'GENERATIVE', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'ai-1', title: 'SYNTHETIC JAGUAR RUN', tag: 'AI GENERATED', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/aijaguar.mp4' },
      { id: 'ai-2', title: 'DIGITAL PARADISE', tag: 'STOCK COMPILATION', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' }
    ]
  },
  wed: { 
    title: 'WEDDING & EVENT', 
    tag: 'CINEMATIC', 
    color: 'var(--scarlet-primary)',
    projects: [
      { id: 'wed-1', title: 'ANISH & KRITIKA - TEASER', tag: 'WEDDING TEASER', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
      { id: 'wed-2', title: 'THE ROYAL WEDDING HIGHLIGHTS', tag: 'CINEMATIC FILM', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' }
    ]
  },
  motion: { 
    title: 'MOTION GRAPHICS', 
    tag: 'ANIMATION', 
    color: '#D998FF',
    projects: [
      { id: 'motion-1', title: 'CYBER TECH LOGO REVEAL', tag: 'LOGO ANIMATION', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' },
      { id: 'motion-2', title: 'KINETIC TYPOGRAPHY PROMO', tag: 'KINETIC TEXT', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' }
    ]
  }
};


const getEmbedUrl = (url) => {
  if (!url) return null;
  
  // YouTube regex
  const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`;
  }
  
  // Vimeo regex
  const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  
  return null;
};

const DomainPage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoAspect, setVideoAspect] = useState(16 / 9);
  const [cmsVideos, setCmsVideos] = useState([]);
  
  const data = domainData[domainId];

  // Fetch CMS videos and merge with hardcoded ones
  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(result => {
        const sectionVideos = (result.videos || [])
          .filter(v => v.section === domainId)
          .map(v => ({ id: v.id, title: v.title, tag: v.tag, videoUrl: v.videoUrl }));
        setCmsVideos(sectionVideos);
      })
      .catch(() => setCmsVideos([])); // silently fail, hardcoded data is fallback
  }, [domainId]);

  // Merge: CMS videos first, then hardcoded
  const mergedData = data ? {
    ...data,
    projects: [...cmsVideos, ...data.projects],
  } : data;

  // Reset aspect ratio when a new video is selected
  const handleSelectVideo = (project) => {
    setVideoAspect(16 / 9); // default until metadata loads
    setSelectedVideo(project);
  };

  // Scroll to top, update title & meta description on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (data) {
      // Store previous values
      const prevTitle = document.title;
      let metaDesc = document.querySelector('meta[name="description"]');
      const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
      
      // Update title
      document.title = `${data.title} // Divyansh Vishwakarma`;
      
      // Update or create meta description
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Explore ${data.title} video editing style by Divyansh Vishwakarma. Cinematic storytelling, pacing, and post-production archives.`);
      
      // Cleanup on unmount
      return () => {
        document.title = prevTitle;
        if (metaDesc) {
          if (prevDesc) {
            metaDesc.setAttribute('content', prevDesc);
          } else {
            metaDesc.remove();
          }
        }
      };
    }
  }, [data]);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl tracking-widest">DOMAIN NOT FOUND</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-32 pb-24 px-8 md:px-16" style={{ backgroundColor: 'var(--bg-deep)' }}>
      
      {/* HEADER SECTION */}
      <div className="mb-16">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm uppercase tracking-widest mb-8 transition-colors duration-300 hover:text-white"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK TO DOMAINS
        </button>

        <div className="flex items-center gap-3 mb-4" style={{ color: data.color }}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
          <span className="text-xs uppercase tracking-[4px] font-bold">{data.tag} // ARCHIVE</span>
        </div>
        
        <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
          {data.title}
        </h1>
      </div>

      {/* VIDEO GRID GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(mergedData.projects || []).map((project, index) => (
          <div 
            key={project.id || index}
            className="group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              backgroundColor: 'var(--bg-surface)',
              boxShadow: `0 0 0 rgba(0,0,0,0)`
            }}
            onClick={() => handleSelectVideo(project)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.boxShadow = `0 15px 40px ${data.color}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}
          >
            {/* Grainy Noise Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
            
            {/* Dynamic neon blur spotlight background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-80">
              <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: data.color }}></div>
            </div>

            {/* Video First-Frame Thumbnail Background */}
            <video
              src={project.videoUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-85 transition-opacity duration-500 z-0 pointer-events-none"
              preload="metadata"
              muted
              playsInline
            />

            {/* Central Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform duration-300 group-hover:scale-110" 
                style={{ backgroundColor: 'rgba(13,13,13,0.4)', borderColor: data.color }}
              >
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>

            {/* Video Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10 flex flex-col justify-end p-6">
              <span className="inline-block self-start px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border backdrop-blur-sm mb-2" style={{ color: data.color, borderColor: data.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                {project.tag}
              </span>
              <span className="text-white text-lg font-bold uppercase tracking-widest leading-tight">{project.title}</span>
              <span className="text-[10px] uppercase tracking-[2px] mt-1" style={{ color: 'var(--text-muted)' }}>PLAY VIDEO ↗</span>
            </div>
          </div>
        ))}
      </div>

      {/* GORGEOUS VIDEO LIGHTBOX/MODAL */}
      {selectedVideo && (() => {
        const projects = mergedData.projects || [];
        const currentIndex = projects.findIndex(p => p.id === selectedVideo.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < projects.length - 1;

        const goToPrev = (e) => {
          e.stopPropagation();
          if (hasPrev) handleSelectVideo(projects[currentIndex - 1]);
        };
        const goToNext = (e) => {
          e.stopPropagation();
          if (hasNext) handleSelectVideo(projects[currentIndex + 1]);
        };

        return (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/95"
          onClick={() => setSelectedVideo(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' && hasPrev) handleSelectVideo(projects[currentIndex - 1]);
            if (e.key === 'ArrowRight' && hasNext) handleSelectVideo(projects[currentIndex + 1]);
          }}
          tabIndex={0}
          ref={(el) => el && el.focus()}
        >
          {/* Custom Animation */}
          <style>{`
            @keyframes scaleEntry {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .scale-entry {
              animation: scaleEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          {/* PREV Arrow — outside modal container, on the left */}
          {hasPrev && (
            <button
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/60 border border-white/15 hover:border-white/40 text-white transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md"
              onClick={goToPrev}
              aria-label="Previous video"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}

          {/* NEXT Arrow — outside modal container, on the right */}
          {hasNext && (
            <button
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/60 border border-white/15 hover:border-white/40 text-white transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md"
              onClick={goToNext}
              aria-label="Next video"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}

          {/* Modal Container */}
          <div 
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl scale-entry"
            style={{ 
              boxShadow: `0 25px 60px -15px ${data.color}25`,
              maxWidth: videoAspect < 1 
                ? `min(400px, 90vw, calc(75vh * ${videoAspect}))` 
                : `min(1280px, 90vw, calc(75vh * ${videoAspect}))`,
              maxHeight: '75vh',
              width: '100%',
              aspectRatio: `${videoAspect}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video or IFrame element */}
            <div className="w-full h-full bg-black">
              {getEmbedUrl(selectedVideo.videoUrl) ? (
                <iframe 
                  src={getEmbedUrl(selectedVideo.videoUrl)} 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : (
                <video 
                  key={selectedVideo.id}
                  src={selectedVideo.videoUrl} 
                  className="w-full h-full object-contain bg-black"
                  controls 
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const v = e.target;
                    if (v.videoWidth && v.videoHeight) {
                      setVideoAspect(v.videoWidth / v.videoHeight);
                    }
                  }}
                />
              )}
            </div>

            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-black/70 border border-white/15 hover:border-white/30 text-white transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={() => setSelectedVideo(null)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Top Info bar */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white z-20 pointer-events-none">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border mb-1" style={{ color: data.color, borderColor: data.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                    {selectedVideo.tag}
                  </span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-wider leading-tight">{selectedVideo.title}</h3>
                </div>
                {projects.length > 1 && (
                  <span className="text-[11px] uppercase tracking-[2px] font-bold mr-14" style={{ color: data.color }}>
                    {currentIndex + 1} / {projects.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        );
      })()}

    </div>
  );
};

export default DomainPage;

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
      { id: 'reels-1', title: 'THE MILLIONAIRE MINDSET', tag: 'PODCAST REEL', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' },
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
      { id: 'beat-1', title: 'WANDERLUST ICELAND', tag: 'TRAVEL SYNC', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' },
      { id: 'beat-2', title: 'NEON STREETS TOKYO', tag: 'BEAT SYNC', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' }
    ]
  },
  long: { 
    title: 'LONG FORMAT PODCAST', 
    tag: 'RETENTION', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'long-1', title: 'CREATOR TALKS EPISODE', tag: 'FULL EPISODE', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
      { id: 'long-2', title: 'THE FUTURE OF WORKPLACE', tag: 'DISCUSSION', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-grassy-hill-42223-large.mp4' }
    ]
  },
  ai: { 
    title: 'AI & STOCK MEDIA', 
    tag: 'GENERATIVE', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'ai-1', title: 'SYNTHETIC DREAMSCAPES', tag: 'AI GENERATED', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4' },
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
  }
};

const DomainPage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const data = domainData[domainId];

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
        
        <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
          {data.title}
        </h1>
      </div>

      {/* VIDEO GRID GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(data.projects || []).map((project, index) => (
          <div 
            key={project.id || index}
            className="group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              backgroundColor: 'var(--bg-surface)',
              boxShadow: `0 0 0 rgba(0,0,0,0)`
            }}
            onClick={() => setSelectedVideo(project)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.boxShadow = `0 15px 40px ${data.color}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}
          >
            {/* Grainy Noise Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
            
            {/* Dynamic neon blur spotlight background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#191919] to-[#0D0D0D] z-0 flex items-center justify-center opacity-80">
              <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: data.color }}></div>
            </div>

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
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/95 transition-all duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl flex flex-col scale-entry"
            style={{ boxShadow: `0 25px 60px -15px ${data.color}25` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom Animation helper */}
            <style>{`
              @keyframes scaleEntry {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
              }
              .scale-entry {
                animation: scaleEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>

            {/* Video element */}
            <video 
              src={selectedVideo.videoUrl} 
              className="w-full h-full object-contain"
              controls 
              autoPlay 
              playsInline
            />
            
            {/* Bottom Info bar */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-10">
              <span className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-[2px] font-bold rounded-sm border mb-2" style={{ color: data.color, borderColor: data.color, backgroundColor: 'rgba(13, 13, 13, 0.5)' }}>
                {selectedVideo.tag}
              </span>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider leading-tight">{selectedVideo.title}</h3>
            </div>

            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-black/70 border border-white/15 hover:border-white/30 text-white transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={() => setSelectedVideo(null)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DomainPage;

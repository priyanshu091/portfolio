import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const domainData = {
  doc: { 
    title: 'DOCUMENTARY & FACT STYLE', 
    tag: 'LONG FORM', 
    color: 'var(--scarlet-primary)',
    projects: [
      { id: 'doc-1781252685751', title: 'WHY DID INDIA INCREASE IMPORT DUTY ON GOLD & SILVER?', tag: 'DOCUMENTARY', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781252672159-Documantary.mp4' }
    ]
  },
  reels: { 
    title: 'PODCAST REELS', 
    tag: 'SHORT FORM', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'reels-1781251025636', title: 'POONAM VIJAY THAKKAR', tag: 'PODCAST ', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781251006705-pvt_2-2.mp4' }
    ]
  },
  comm: { 
    title: 'COMMERCIAL & BRAND', 
    tag: 'ADVERTISING', 
    color: '#FFFFFF',
    projects: [
      { id: 'comm-1781253123509', title: 'MARKETING VIDEO ', tag: 'SIMPLE BRAND VIDEO ', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781253108762-5-_digiansh-.mov' },
      { id: 'comm-1781255937451', title: 'CHOICE CONNECT ', tag: 'BRAND VIDEO ', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781255918878-Untitled.mp4' },
      { id: 'comm-1781256326538', title: 'CHOICE CONNECT ', tag: 'MARKETING VIDEO', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256320981-choice.mp4' },
      { id: 'comm-1781256752747', title: 'ALUZE BRAND VIDEO ', tag: 'MARKETING VIDEO', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256744582-0501_2_.mp4' }
    ]
  },
  beat: { 
    title: 'BEAT SYNC & TRAVEL', 
    tag: 'DYNAMIC', 
    color: 'var(--scarlet-glow)',
    projects: [
      { id: 'beat-1781256622761', title: 'WEDDING EDIT', tag: 'BEAT SYNC', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256616759-0418__1_.mp4' },
      { id: 'beat-1781256701504', title: 'PHILIPPINES EDIT', tag: 'BEAT SYNC', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256694160-3-INSTA.mp4' }
    ]
  },
  long: { 
    title: 'LONG FORMAT PODCAST', 
    tag: 'RETENTION', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'long-1781252288870', title: 'DIGITAL ARREST SCAM', tag: 'MOTION GRAPHIC INTRO', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781252268916-Podcast_Sample.mp4' }
    ]
  },
  ai: { 
    title: 'AI & STOCK MEDIA', 
    tag: 'GENERATIVE', 
    color: 'var(--cyan-primary)',
    projects: [
      { id: 'ai-1781256565135', title: 'BLACK PANTHER', tag: 'HIGH QUALITY AI VIDEO ', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256548984-AI_VIDEO_-02_4K_.mp4' }
    ]
  },
  wed: { 
    title: 'WEDDING & EVENT', 
    tag: 'CINEMATIC', 
    color: 'var(--scarlet-primary)',
    projects: [
      { id: 'wed-1781252946061', title: 'WEDDING VIDEO ', tag: 'BRIDE EDIT', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781252935768-Bride_02__without_Flare_.mp4' },
      { id: 'wed-1781253028954', title: 'WEDDING VIDEO', tag: 'BRIDE REELS EDIT', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781253014437-Bride_01.mp4' },
      { id: 'wed-1781256876067', title: 'BRIDE REELS ', tag: 'BEAT SYNC', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781256848110-wedding.mp4' }
    ]
  },
  motion: { 
    title: 'MOTION GRAPHICS', 
    tag: 'ANIMATION', 
    color: '#D998FF',
    projects: [
      { id: 'motion-1781251838070', title: 'EDACTION STUDIOS', tag: 'MOTION GRAPHICS', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781251832889-MotionGraphics.mp4' },
      { id: 'motion-1781251943453', title: 'DOON TRADING ACADEMY', tag: 'MOTION GRAPHICS', videoUrl: 'https://divyanshassets091.blob.core.windows.net/portfolio-media/1781251940823-MotionGraphics__1_.mp4' }
    ]
  },
  'real-estate': { 
    title: 'PROPERTY & REAL ESTATE', 
    tag: 'ARCHITECTURE', 
    color: '#00FF9D',
    projects: []
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

const LazyVideo = ({ src, thumbnailUrl, className, isPaused }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ position: 'absolute', inset: 0 }}>
      {visible && !isPaused && (
        thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="thumbnail"
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <video
            src={`${src}#t=0.1`}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )
      )}
    </div>
  );
};

const DomainPage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoAspect, setVideoAspect] = useState(16 / 9);
  const [loadedUrl, setLoadedUrl] = useState(null);
  const [isCustomBuffering, setIsCustomBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [cmsVideos, setCmsVideos] = useState([]);
  const [dynamicData, setDynamicData] = useState(null); // for custom sections not in hardcoded list
  
  const hardcodedData = domainData[domainId];

  // Fetch CMS videos and merge with hardcoded ones
  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(result => {
        const sectionVideos = (result.videos || [])
          .filter(v => v.section === domainId)
          .map(v => ({ id: v.id, title: v.title, tag: v.tag, videoUrl: v.videoUrl, thumbnailUrl: v.thumbnailUrl }));
        setCmsVideos(sectionVideos);

        // If domainId not in hardcoded data, look for it in customSections
        if (!domainData[domainId] && result.customSections) {
          const customSection = result.customSections.find(s => s.id === domainId);
          if (customSection) {
            setDynamicData({
              title: customSection.label.toUpperCase(),
              tag: customSection.group.toUpperCase(),
              color: customSection.color,
              projects: [],
            });
          }
        }
      })
      .catch(() => setCmsVideos([])); // silently fail, hardcoded data is fallback
  }, [domainId]);

  // Use hardcoded data if available, otherwise dynamic data from API
  const data = hardcodedData || dynamicData;

  // Merge: CMS videos first, then hardcoded projects
  const mergedData = data ? {
    ...data,
    projects: [...cmsVideos, ...(data.projects || [])],
  } : data;

  // Reset aspect ratio when a new video is selected
  const handleSelectVideo = (project) => {
    setVideoAspect(16 / 9); // default until metadata loads
    setIsCustomBuffering(true);
    setBufferProgress(0);
    setSelectedVideo(project);
  };

  // Parallel multi-threaded chunk downloader to prevent slow Azure streaming
  useEffect(() => {
    if (!selectedVideo) {
      setLoadedUrl(null);
      return;
    }
    
    const embedUrl = getEmbedUrl(selectedVideo.videoUrl);
    if (embedUrl) {
      setLoadedUrl(embedUrl);
      setIsCustomBuffering(false);
      return;
    }
    
    let active = true;
    let createdUrl = null;
    setIsCustomBuffering(true);
    setBufferProgress(0);
    
    const controller = new AbortController();
    
    const startDownload = async () => {
      try {
        const headRes = await fetch(selectedVideo.videoUrl, { method: 'HEAD', signal: controller.signal });
        let totalSize = parseInt(headRes.headers.get('Content-Length'), 10);
        
        if (!totalSize || isNaN(totalSize)) {
          const rangeRes = await fetch(selectedVideo.videoUrl, { headers: { Range: 'bytes=0-0' }, signal: controller.signal });
          const contentRange = rangeRes.headers.get('Content-Range');
          if (contentRange) {
            totalSize = parseInt(contentRange.split('/')[1], 10);
          }
        }
        
        if (!totalSize || isNaN(totalSize) || totalSize > 400 * 1024 * 1024) {
          if (active) {
            setLoadedUrl(selectedVideo.videoUrl);
            setIsCustomBuffering(false);
          }
          return;
        }
        
        const chunkSize = 4 * 1024 * 1024; // 4MB
        const numChunks = Math.ceil(totalSize / chunkSize);
        let loadedBytes = 0;
        
        const downloadChunk = async (index) => {
          const start = index * chunkSize;
          const end = Math.min(start + chunkSize - 1, totalSize - 1);
          
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const res = await fetch(selectedVideo.videoUrl, {
                headers: { Range: `bytes=${start}-${end}` },
                signal: controller.signal
              });
              if (!res.ok) throw new Error(`Status ${res.status}`);
              const buffer = await res.arrayBuffer();
              
              if (!active) return;
              loadedBytes += buffer.byteLength;
              setBufferProgress(Math.min(99, Math.round((loadedBytes / totalSize) * 100)));
              
              return { index, buffer };
            } catch (err) {
              if (attempt === 2 || controller.signal.aborted) throw err;
            }
          }
        };
        
        const promises = Array.from({ length: numChunks }, (_, i) => downloadChunk(i));
        const results = await Promise.all(promises);
        
        if (!active) return;
        
        results.sort((a, b) => a.index - b.index);
        
        const finalArray = new Uint8Array(totalSize);
        let offset = 0;
        for (const result of results) {
          finalArray.set(new Uint8Array(result.buffer), offset);
          offset += result.buffer.byteLength;
        }
        
        const blob = new Blob([finalArray], { type: 'video/mp4' });
        createdUrl = URL.createObjectURL(blob);
        
        if (active) {
          setLoadedUrl(createdUrl);
          setBufferProgress(100);
          setIsCustomBuffering(false);
        } else {
          URL.revokeObjectURL(createdUrl);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          console.error("Parallel preloader failed, streaming direct:", err);
          setLoadedUrl(selectedVideo.videoUrl);
          setIsCustomBuffering(false);
        }
      }
    };
    
    startDownload();
    
    return () => {
      active = false;
      controller.abort();
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [selectedVideo]);

  const containerRef = useRef(null);

  // Lock body scroll and scroll modal to top on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Update title & meta description on mount
  useEffect(() => {
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
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[90] w-full h-full overflow-y-auto pt-32 pb-24 px-8 md:px-16" 
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      
      {/* HEADER SECTION */}
      <div className="mb-16">
        <button 
          onClick={() => navigate(-1)}
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
            <LazyVideo
              src={project.videoUrl}
              thumbnailUrl={project.thumbnailUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-85 transition-opacity duration-500 z-0 pointer-events-none"
              isPaused={selectedVideo !== null}
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
            <div className="w-full h-full bg-black relative">
              {/* Custom Buffering Overlay */}
              {isCustomBuffering && (
                <div 
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${data.color} transparent transparent transparent`, borderWidth: '3px' }}></div>
                    <div className="text-center">
                      <p className="text-white text-[11px] font-bold uppercase tracking-[3px] mb-1">STABILIZING STREAM</p>
                      <p className="text-[10px] uppercase tracking-[1.5px]" style={{ color: 'var(--text-secondary)' }}>
                        BUFFERED {bufferProgress}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {getEmbedUrl(selectedVideo.videoUrl) ? (
                <iframe 
                  src={loadedUrl || getEmbedUrl(selectedVideo.videoUrl)} 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : (
                loadedUrl && (
                  <video 
                    key={selectedVideo.id}
                    src={loadedUrl} 
                    className="w-full h-full object-contain bg-black"
                    controls 
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      const v = e.target;
                      if (v.videoWidth && v.videoHeight) {
                        setVideoAspect(v.videoWidth / v.videoHeight);
                      }
                    }}
                  />
                )
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

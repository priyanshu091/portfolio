import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const domainData = {
  doc: { title: 'DOCUMENTARY & FACT STYLE', tag: 'LONG FORM', color: 'var(--scarlet-primary)' },
  reels: { title: 'PODCAST REELS', tag: 'SHORT FORM', color: 'var(--cyan-primary)' },
  comm: { title: 'COMMERCIAL & BRAND', tag: 'ADVERTISING', color: '#FFFFFF' },
  beat: { title: 'BEAT SYNC & TRAVEL', tag: 'DYNAMIC', color: 'var(--scarlet-glow)' },
  long: { title: 'LONG FORMAT PODCAST', tag: 'RETENTION', color: 'var(--cyan-primary)' },
  ai: { title: 'AI & STOCK MEDIA', tag: 'GENERATIVE', color: 'var(--cyan-primary)' },
  wed: { title: 'WEDDING & EVENT', tag: 'CINEMATIC', color: 'var(--scarlet-primary)' }
};

const DomainPage = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  
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
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="group relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              backgroundColor: 'var(--bg-surface)',
              boxShadow: `0 0 0 rgba(0,0,0,0)`
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.boxShadow = `0 15px 40px ${data.color}22`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`; }}
          >
            {/* Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
            
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6">
              <span className="text-white text-lg font-bold uppercase tracking-widest">PROJECT_{index + 1}</span>
              <span className="text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--text-muted)' }}>4K // CLIENT WORK</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DomainPage;

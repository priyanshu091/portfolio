import React, { useState, useEffect, useRef, useCallback } from 'react';

// Section config — matches portfolio categories
const SECTIONS = [
  { id: 'doc',  label: 'Documentary & Fact', color: '#FF3B30' },
  { id: 'reels', label: 'Podcast Reels', color: '#00D4FF' },
  { id: 'comm', label: 'Commercial & Brand', color: '#FFFFFF' },
  { id: 'beat', label: 'Beat Sync & Travel', color: '#FF6B3B' },
  { id: 'long', label: 'Long Format Podcast', color: '#00D4FF' },
  { id: 'ai',   label: 'AI & Stock Media', color: '#00D4FF' },
  { id: 'wed',  label: 'Wedding & Event', color: '#FF3B30' },
  { id: 'motion', label: 'Motion Graphics', color: '#D998FF' },
];

const API_BASE = '/api';

function getToken() {
  return sessionStorage.getItem('admin_token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

const LazyVideo = ({ src, style, isPaused }) => {
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
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {visible && !isPaused && (
        <video
          src={`${src}#t=0.1`}
          className="preview-video-element"
          style={{ ...style, opacity: 0.6, transition: 'opacity 0.4s' }}
          preload="metadata"
          muted
          playsInline
        />
      )}
    </div>
  );
};

/* ───────────────────── LOGIN SCREEN ───────────────────── */
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      sessionStorage.setItem('admin_token', data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginWrapper}>
      <form onSubmit={handleSubmit} style={styles.loginCard}>
        <div style={styles.loginLogo}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h1 style={styles.loginTitle}>ADMIN CMS</h1>
        <p style={styles.loginSub}>Enter your password to manage videos</p>
        
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoFocus
        />
        
        {error && <p style={styles.error}>{error}</p>}
        
        <button type="submit" disabled={loading || !password} style={{
          ...styles.primaryBtn,
          opacity: loading || !password ? 0.5 : 1,
        }}>
          {loading ? 'AUTHENTICATING...' : 'LOGIN'}
        </button>
      </form>
    </div>
  );
}

/* ───────────────────── UPLOAD MODAL ───────────────────── */
function UploadModal({ onClose, onUploaded, defaultSection }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [section, setSection] = useState(defaultSection || 'doc');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | saving | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('video/')) {
      setFile(dropped);
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !title || !tag) return;
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      // Step 1: Get SAS upload URL from our API
      const sasRes = await fetch(`${API_BASE}/upload-url`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ filename: file.name }),
      });
      const sasData = await sasRes.json();
      if (!sasRes.ok) throw new Error(sasData.error || 'Failed to get upload URL');

      // Step 2: Upload directly to Azure using SAS URL
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', sasData.uploadUrl, true);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      // Step 3: Save metadata to our API
      setStatus('saving');
      const metaRes = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          section,
          title,
          tag,
          videoUrl: sasData.publicUrl,
        }),
      });
      const metaData = await metaRes.json();
      if (!metaRes.ok) throw new Error(metaData.error || 'Failed to save metadata');

      setStatus('done');
      setTimeout(() => {
        onUploaded();
        onClose();
      }, 1200);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(1) : 0;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>UPLOAD VIDEO</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Drop Zone */}
        <div
          style={{
            ...styles.dropZone,
            borderColor: dragOver ? '#FF3B30' : file ? '#2D8B4E' : '#333',
            background: dragOver ? 'rgba(255,59,48,0.05)' : file ? 'rgba(45,139,78,0.05)' : 'transparent',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <div style={{ textAlign: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2D8B4E" strokeWidth="1.5" style={{ marginBottom: 8 }}>
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{file.name}</p>
              <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{fileSizeMB} MB</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom: 8 }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ color: '#888', fontSize: 14 }}>Drop a video here or <span style={{ color: '#FF3B30', cursor: 'pointer' }}>browse</span></p>
              <p style={{ color: '#555', fontSize: 11, marginTop: 4 }}>MP4, MOV, WebM — Max 500MB</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>VIDEO TITLE</label>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GARTANG GALI EXPEDITION"
            />
          </div>
          <div>
            <label style={styles.label}>TAG</label>
            <input
              style={styles.input}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. TRAVEL SYNC"
            />
          </div>
        </div>

        <label style={styles.label}>SECTION</label>
        <select
          style={styles.select}
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        {/* Progress Bar */}
        {(status === 'uploading' || status === 'saving') && (
          <div style={styles.progressWrap}>
            <div style={{ ...styles.progressBar, width: `${status === 'saving' ? 100 : progress}%` }} />
            <span style={styles.progressText}>
              {status === 'saving' ? 'Saving metadata...' : `Uploading — ${progress}%`}
            </span>
          </div>
        )}

        {status === 'done' && (
          <div style={{ ...styles.statusMsg, color: '#2D8B4E' }}>
            ✓ Video uploaded successfully!
          </div>
        )}

        {status === 'error' && (
          <div style={{ ...styles.statusMsg, color: '#FF3B30' }}>
            ✕ {errorMsg}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || !title || !tag || status === 'uploading' || status === 'saving' || status === 'done'}
          style={{
            ...styles.primaryBtn,
            marginTop: 16,
            opacity: (!file || !title || !tag || status === 'uploading' || status === 'saving' || status === 'done') ? 0.4 : 1,
          }}
        >
          {status === 'uploading' ? 'UPLOADING...' : status === 'saving' ? 'SAVING...' : status === 'done' ? 'DONE ✓' : 'UPLOAD TO AZURE'}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── DASHBOARD ───────────────────── */
function Dashboard({ onLogout }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/videos`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/videos`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchVideos();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = activeSection === 'all' 
    ? videos 
    : videos.filter(v => v.section === activeSection);

  const sectionCounts = SECTIONS.reduce((acc, s) => {
    acc[s.id] = videos.filter(v => v.section === s.id).length;
    return acc;
  }, {});

  return (
    <div style={styles.dashboard}>
      <style>{`
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* Header */}
      <header style={styles.dashHeader}>
        <div>
          <h1 style={styles.dashTitle}>VIDEO CMS</h1>
          <p style={styles.dashSub}>{videos.length} videos across {SECTIONS.length} sections</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => setShowUpload(true)} 
            style={styles.uploadBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.background = '#FF4F46';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 59, 48, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.background = '#FF3B30';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            UPLOAD VIDEO
          </button>
          <button 
            onClick={onLogout} 
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.borderColor = '#888';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#888';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Section Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveSection('all')}
          style={{
            ...styles.tab,
            ...(activeSection === 'all' ? styles.tabActive : {}),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.borderColor = '#FF3B30';
            e.currentTarget.style.color = '#FF3B30';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 59, 48, 0.45)';
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            if (activeSection !== 'all') {
              e.currentTarget.style.borderColor = '#222';
              e.currentTarget.style.color = '#555';
              e.currentTarget.style.background = 'transparent';
            } else {
              e.currentTarget.style.borderColor = '#FF3B30';
              e.currentTarget.style.color = '#FF3B30';
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)';
            }
          }}
        >
          ALL ({videos.length})
        </button>
        {SECTIONS.map(s => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                ...styles.tab,
                ...(isActive ? { ...styles.tabActive, borderColor: s.color, color: s.color, background: `${s.color}14` } : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.borderColor = s.color;
                e.currentTarget.style.color = s.color;
                e.currentTarget.style.boxShadow = `0 0 15px ${s.color}55`;
                e.currentTarget.style.background = `${s.color}24`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.color = '#555';
                  e.currentTarget.style.background = 'transparent';
                } else {
                  e.currentTarget.style.borderColor = s.color;
                  e.currentTarget.style.color = s.color;
                  e.currentTarget.style.background = `${s.color}14`;
                }
              }}
            >
              {s.label.toUpperCase()} ({sectionCounts[s.id] || 0})
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div style={styles.emptyState}>
          <p style={{ color: '#888' }}>Loading videos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" style={{ marginBottom: 12 }}>
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="M2 12h4M18 12h4M12 2v4M12 18v4"/>
          </svg>
          <p style={{ color: '#555', fontSize: 14 }}>No videos in this section</p>
          <button onClick={() => setShowUpload(true)} style={{ ...styles.primaryBtn, marginTop: 12, fontSize: 12 }}>
            UPLOAD FIRST VIDEO
          </button>
        </div>
      ) : (
        <div style={styles.videoGrid}>
          {filtered.map((video, index) => {
            const sectionInfo = SECTIONS.find(s => s.id === video.section);
            const isPlaying = playingId === video.id;
            return (
              <div 
                key={video.id} 
                style={{
                  ...styles.videoCard,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: 0,
                  animation: 'cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  animationDelay: `${index * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.borderColor = sectionInfo?.color || '#FF3B30';
                  e.currentTarget.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.6), 0 0 15px ${sectionInfo?.color || '#FF3B30'}33`;
                  const videoEl = e.currentTarget.querySelector('.preview-video-element');
                  if (videoEl) videoEl.style.opacity = '0.85';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = '#1A1A1A';
                  e.currentTarget.style.boxShadow = 'none';
                  const videoEl = e.currentTarget.querySelector('.preview-video-element');
                  if (videoEl) videoEl.style.opacity = '0.6';
                }}
              >
                 {/* Video Preview */}
                <div style={styles.videoPreview}>
                  {isPlaying ? (
                    <video
                      src={video.videoUrl}
                      style={styles.videoThumb}
                      controls
                      autoPlay
                      preload="auto"
                    />
                  ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPlayingId(video.id)}>
                      <LazyVideo
                        src={video.videoUrl}
                        style={styles.videoThumb}
                        isPaused={playingId !== null}
                      />
                      <div style={styles.videoOverlay}>
                        <div 
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(13,13,13,0.5)',
                            border: `1.5px solid ${sectionInfo?.color || '#FF3B30'}`,
                            boxShadow: `0 0 15px ${(sectionInfo?.color || '#FF3B30')}40`,
                            transition: 'transform 0.2s',
                          }}
                        >
                          <div style={{
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: '6px 0 6px 10px',
                            borderColor: 'transparent transparent transparent #fff',
                            marginLeft: '3px',
                          }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={styles.videoInfo}>
                  <span style={{
                    ...styles.videoTag,
                    color: sectionInfo?.color || '#888',
                    borderColor: sectionInfo?.color || '#333',
                  }}>
                    {video.tag}
                  </span>
                  <h3 style={styles.videoTitle}>{video.title}</h3>
                  <div style={styles.videoMeta}>
                    <span style={{ color: '#555', fontSize: 11 }}>
                      {sectionInfo?.label || video.section}
                    </span>
                    <button
                      onClick={() => setDeleteConfirm(video.id)}
                      style={styles.deleteBtn}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                      </svg>
                    </button>
                  </div>
                  {video.createdAt && (
                    <div style={{ color: '#666', fontSize: 10, marginTop: 8, fontFamily: 'monospace' }}>
                      UPLOADED: {new Date(video.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}
                </div>

                {/* Delete Confirm */}
                {deleteConfirm === video.id && (
                  <div style={styles.deleteOverlay}>
                    <p style={{ color: '#fff', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>Delete this video?</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleDelete(video.id)} style={{ ...styles.primaryBtn, background: '#FF3B30', fontSize: 11, padding: '8px 16px' }}>DELETE</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ ...styles.primaryBtn, background: '#333', fontSize: 11, padding: '8px 16px' }}>CANCEL</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={fetchVideos}
          defaultSection={activeSection !== 'all' ? activeSection : 'doc'}
        />
      )}
    </div>
  );
}

/* ───────────────────── ADMIN PANEL (wrapper) ───────────────────── */
export default function AdminPanel() {
  const [authed, setAuthed] = useState(!!getToken());

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setAuthed(false);
  };

  return authed
    ? <Dashboard onLogout={handleLogout} />
    : <LoginScreen onLogin={() => setAuthed(true)} />;
}

/* ───────────────────── STYLES ───────────────────── */
const styles = {
  /* Login */
  loginWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0A0A0A',
    padding: '110px 20px 20px',
    boxSizing: 'border-box',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: 40,
    background: '#111',
    borderRadius: 16,
    border: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginLogo: { marginBottom: 16 },
  loginTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '4px',
    marginBottom: 6,
  },
  loginSub: {
    color: '#666',
    fontSize: 12,
    marginBottom: 28,
    letterSpacing: '1px',
  },

  /* Inputs */
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: 'pointer',
  },
  label: {
    display: 'block',
    color: '#555',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '2px',
    marginBottom: 6,
    marginTop: 12,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  primaryBtn: {
    width: '100%',
    padding: '14px 24px',
    background: '#FF3B30',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: 20,
  },

  /* Dashboard */
  dashboard: {
    minHeight: '100vh',
    background: '#0A0A0A',
    padding: '100px 24px 40px',
    boxSizing: 'border-box',
  },
  dashHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid #1A1A1A',
    flexWrap: 'wrap',
    gap: 16,
  },
  dashTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '3px',
  },
  dashSub: {
    color: '#555',
    fontSize: 12,
    letterSpacing: '1px',
    marginTop: 4,
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#FF3B30',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: 8,
    color: '#888',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },

  /* Tabs */
  tabs: {
    display: 'flex',
    gap: 4,
    padding: '20px 0',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
  },
  tab: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid #222',
    borderRadius: 20,
    color: '#555',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    flexShrink: 0,
  },
  tabActive: {
    borderColor: '#FF3B30',
    color: '#FF3B30',
    background: 'rgba(255,59,48,0.08)',
  },

  /* Video Grid */
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
    marginTop: 8,
  },
  videoCard: {
    background: '#111',
    borderRadius: 12,
    border: '1px solid #1A1A1A',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
    position: 'relative',
  },
  videoPreview: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    opacity: 0.7,
    transition: 'opacity 0.2s',
  },
  videoInfo: {
    padding: '12px 16px',
  },
  videoTag: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '1.5px',
    border: '1px solid',
    borderRadius: 3,
    marginBottom: 6,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '1px',
    marginBottom: 8,
  },
  videoMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: 6,
    padding: '4px 8px',
    color: '#555',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    zIndex: 5,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },

  /* Modal */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    background: '#111',
    borderRadius: 16,
    border: '1px solid #222',
    padding: 28,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '3px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#555',
    fontSize: 18,
    cursor: 'pointer',
  },
  dropZone: {
    border: '2px dashed',
    borderRadius: 12,
    padding: '36px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginTop: 16,
  },
  progressWrap: {
    position: 'relative',
    height: 36,
    background: '#1A1A1A',
    borderRadius: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: 'linear-gradient(90deg, #FF3B30, #FF6B3B)',
    borderRadius: 8,
    transition: 'width 0.3s ease',
  },
  progressText: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '1px',
    zIndex: 2,
  },
  statusMsg: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
    letterSpacing: '1px',
  },
};

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Default hardcoded section config — can be extended via CMS customSections
const DEFAULT_SECTIONS = [
  // ── Edited Videos (sub-categories / domains) ──
  { id: 'doc',    label: 'Documentary & Fact',    color: '#FF3B30', group: 'Edited Videos' },
  { id: 'reels',  label: 'Podcast Reels',         color: '#00D4FF', group: 'Edited Videos' },
  { id: 'comm',   label: 'Commercial & Brand',    color: '#FFFFFF', group: 'Edited Videos' },
  { id: 'beat',   label: 'Beat Sync & Travel',    color: '#FF6B3B', group: 'Edited Videos' },
  { id: 'long',   label: 'Long Format Podcast',   color: '#00D4FF', group: 'Edited Videos' },
  { id: 'ai',     label: 'AI & Stock Media',      color: '#00D4FF', group: 'Edited Videos' },
  { id: 'wed',    label: 'Wedding & Event',       color: '#FF3B30', group: 'Edited Videos' },
  { id: 'motion', label: 'Motion Graphics',       color: '#D998FF', group: 'Edited Videos' },
  { id: 'real-estate', label: 'Property & Real Estate', color: '#00FF9D', group: 'Edited Videos' },
  // ── Full Production ──
  { id: 'full-production', label: 'Full Production', color: '#FF2D55', group: 'Full Production' },
  // ── Graphic Designing ──
  { id: 'graphic-design', label: 'Graphic Designing', color: '#FFCC00', group: 'Graphic Designing' },
];

const CATEGORY_GROUPS = ['Edited Videos', 'Full Production', 'Graphic Designing'];

// Merge default + custom sections, avoiding duplicates by ID
function mergeSections(customSections = []) {
  const merged = [...DEFAULT_SECTIONS];
  for (const cs of customSections) {
    if (!merged.some(s => s.id === cs.id)) {
      merged.push(cs);
    }
  }
  return merged;
}

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

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMsg = `Server returned status ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) errorMsg = data.error;
    } catch (_) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        errorMsg += '. (Note: If running locally via npm run dev, Vite does not execute Vercel serverless functions. Run "vercel dev" instead to access local APIs)';
      }
    }
    throw new Error(errorMsg);
  }
  try {
    return await res.json();
  } catch (err) {
    throw new Error('Failed to parse response as JSON');
  }
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await fetchJson(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
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
        
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, paddingRight: 44 }}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showPassword ? '#FF3B30' : '#555',
              transition: 'color 0.2s',
            }}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        </div>
        
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
function UploadModal({ onClose, onUploaded, defaultSection, sections }) {
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [section, setSection] = useState(defaultSection || 'doc');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | saving | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [thumbnailDragOver, setThumbnailDragOver] = useState(false);
  
  const fileRef = useRef(null);
  const thumbFileRef = useRef(null);

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
      let thumbnailUrl = null;

      // Step 1: Upload custom thumbnail if selected
      if (thumbnailFile) {
        // Get SAS URL for thumbnail image
        const sasData = await fetchJson(`${API_BASE}/upload-url`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ filename: thumbnailFile.name }),
        });

        // Upload directly to Azure
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', sasData.uploadUrl, true);
          xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
          xhr.setRequestHeader('Content-Type', thumbnailFile.type || 'image/jpeg');

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Thumbnail upload failed: ${xhr.status}`));
          };
          xhr.onerror = () => reject(new Error('Network error during thumbnail upload'));
          xhr.send(thumbnailFile);
        });
        thumbnailUrl = sasData.publicUrl;
      }

      // Step 2: Get SAS upload URL for the video
      const sasData = await fetchJson(`${API_BASE}/upload-url`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ filename: file.name }),
      });

      // Step 3: Upload video directly to Azure using SAS URL
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

      // Step 4: Save metadata to our API (including thumbnailUrl if any)
      setStatus('saving');
      await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          section,
          title,
          tag,
          videoUrl: sasData.publicUrl,
          thumbnailUrl,
        }),
      });

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

        {/* Video Thumbnail (Optional) */}
        <div style={{ marginTop: 16 }}>
          <label style={styles.label}>CUSTOM VIDEO THUMBNAIL (OPTIONAL)</label>
          <div
            style={{
              ...styles.thumbnailZone,
              borderColor: thumbnailDragOver ? '#FF3B30' : thumbnailFile ? '#2D8B4E' : '#333',
              background: thumbnailDragOver ? 'rgba(255,59,48,0.05)' : thumbnailFile ? 'rgba(45,139,78,0.05)' : 'transparent',
            }}
            onDragOver={(e) => { e.preventDefault(); setThumbnailDragOver(true); }}
            onDragLeave={() => setThumbnailDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setThumbnailDragOver(false);
              const dropped = e.dataTransfer.files[0];
              if (dropped && dropped.type.startsWith('image/')) {
                if (dropped.size > 819200) {
                  setErrorMsg('Thumbnail image exceeds 800 KB limit. Please upload a smaller image.');
                } else {
                  setThumbnailFile(dropped);
                  setErrorMsg('');
                }
              }
            }}
            onClick={() => thumbFileRef.current?.click()}
          >
            <input
              ref={thumbFileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected) {
                  if (selected.size > 819200) {
                    setErrorMsg('Thumbnail image exceeds 800 KB limit. Please upload a smaller image.');
                  } else {
                    setThumbnailFile(selected);
                    setErrorMsg('');
                  }
                }
              }}
            />
            {thumbnailFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D8B4E" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{thumbnailFile.name}</p>
                  <p style={{ color: '#888', fontSize: 11, margin: '2px 0 0' }}>{(thumbnailFile.size / 1024).toFixed(0)} KB (Limit: 800 KB)</p>
                </div>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#ff3b30', fontSize: 16, cursor: 'pointer', marginLeft: 'auto' }}
                  onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); }}
                >✕</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p style={{ color: '#888', fontSize: 12, margin: 0 }}>
                  Drop custom thumbnail here or <span style={{ color: '#FF3B30', cursor: 'pointer' }}>browse</span> (Max 800KB)
                </p>
              </div>
            )}
          </div>
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
          {(() => {
            const secs = sections || DEFAULT_SECTIONS;
            const groups = [...new Set(secs.map(s => s.group))];
            return groups.map(group => (
              <optgroup key={group} label={group}>
                {secs.filter(s => s.group === group).map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </optgroup>
            ));
          })()}
        </select>

        {/* Progress Bar */}
        {(status === 'uploading' || status === 'saving') && (
          <div style={styles.progressWrap}>
            <div style={{ ...styles.progressBar, width: `${status === 'saving' ? 100 : progress}%` }} />
            <span style={styles.progressText}>
              {status === 'saving' ? 'Saving metadata...' : thumbnailFile && progress === 0 ? 'Uploading thumbnail...' : `Uploading video — ${progress}%`}
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

/* ───────────────────── DOMAIN THUMBNAILS MODAL ───────────────────── */
function DomainThumbnailsModal({ onClose, onUpdated, domainThumbnails, sections }) {
  const [uploadingDomainId, setUploadingDomainId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [thumbnails, setThumbnails] = useState(domainThumbnails || {});
  const fileInputRef = useRef(null);
  const currentDomainIdRef = useRef(null);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 819200) {
      setErrorMsg('Image file size exceeds the 800 KB performance limit.');
      return;
    }
    setErrorMsg('');

    const domainId = currentDomainIdRef.current;
    if (!domainId) return;

    setUploadingDomainId(domainId);
    try {
      // Step 1: Get SAS URL from our API
      const sasData = await fetchJson(`${API_BASE}/upload-url`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ filename: file.name }),
      });

      // Step 2: Upload directly to Azure using SAS URL
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', sasData.uploadUrl, true);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('Content-Type', file.type || 'image/jpeg');

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      // Step 3: Save metadata to our API
      const metaData = await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'update_domain_thumbnail',
          domainId,
          imageUrl: sasData.publicUrl,
        }),
      });

      setThumbnails(metaData.domainThumbnails || {});
      onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadingDomainId(null);
    }
  };

  const handleRemoveImage = async (domainId) => {
    setUploadingDomainId(domainId);
    setErrorMsg('');
    try {
      const metaData = await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'update_domain_thumbnail',
          domainId,
          imageUrl: null,
        }),
      });

      setThumbnails(metaData.domainThumbnails || {});
      onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadingDomainId(null);
    }
  };

  const triggerFileSelect = (domainId) => {
    currentDomainIdRef.current = domainId;
    fileInputRef.current?.click();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalCard, maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>MANAGE DOMAIN THUMBNAILS</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <p style={{ color: '#888', fontSize: 12, marginBottom: 16, lineHeight: '1.5' }}>
          Assign custom images to represent categories/domains on the homepage. Images must be <strong>JPEG, PNG, or WebP under 800 KB</strong> to protect performance.
        </p>

        {errorMsg && (
          <div style={{ color: '#FF3B30', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' }}>
            ✕ {errorMsg}
          </div>
        )}

        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUploadImage}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
          {(sections || DEFAULT_SECTIONS).map(s => {
            const currentThumb = thumbnails[s.id];
            const isUploading = uploadingDomainId === s.id;

            return (
              <div 
                key={s.id} 
                style={{ 
                  background: '#1A1A1A', 
                  borderRadius: 12, 
                  border: '1px solid #2A2A2A', 
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 'bold', color: s.color }}>{s.label.toUpperCase()}</span>
                  <span style={{ color: '#555', fontSize: 10, fontFamily: 'monospace' }}>ID: {s.id}</span>
                </div>

                {/* Thumbnail Preview Area */}
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  background: '#0D0D0D', 
                  borderRadius: 6, 
                  overflow: 'hidden', 
                  position: 'relative',
                  border: '1px solid #222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {currentThumb ? (
                    <img 
                      src={currentThumb} 
                      alt={s.label} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ color: '#444', fontSize: 11, textAlign: 'center', padding: 10 }}>
                      No custom thumbnail<br/>(using video preview)
                    </span>
                  )}

                  {isUploading && (
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'rgba(0,0,0,0.8)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      PROCESSING...
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    disabled={isUploading}
                    onClick={() => triggerFileSelect(s.id)}
                    style={{ 
                      flex: 1, 
                      padding: '8px 10px', 
                      background: 'transparent', 
                      border: '1px solid #333', 
                      borderRadius: 6, 
                      color: '#fff', 
                      fontSize: 11, 
                      fontWeight: 'bold',
                      cursor: 'pointer' 
                    }}
                  >
                    UPLOAD
                  </button>
                  {currentThumb && (
                    <button 
                      disabled={isUploading}
                      onClick={() => handleRemoveImage(s.id)}
                      style={{ 
                        padding: '8px 10px', 
                        background: '#FF3B3015', 
                        border: '1px solid #FF3B3050', 
                        borderRadius: 6, 
                        color: '#FF3B30', 
                        fontSize: 11, 
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                      }}
                    >
                      REMOVE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          style={{ ...styles.primaryBtn, marginTop: 20 }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── MANAGE SECTIONS MODAL ───────────────────── */
function ManageSectionsModal({ onClose, onUpdated, sections }) {
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#00D4FF');
  const [newGroup, setNewGroup] = useState('Edited Videos');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const colorPresets = ['#FF3B30', '#00D4FF', '#FFCC00', '#00FF9D', '#D998FF', '#FF6B3B', '#FF2D55', '#FFFFFF', '#FF5470', '#8B5CF6'];

  const generateId = (label) => {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleAddSection = async () => {
    if (!newLabel.trim()) return;
    const sectionId = generateId(newLabel);
    if (!sectionId) return;

    // Check for duplicate
    if (sections.some(s => s.id === sectionId)) {
      setErrorMsg(`A section with ID "${sectionId}" already exists.`);
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'add_section',
          sectionId,
          label: newLabel.trim(),
          color: newColor,
          group: newGroup,
        }),
      });
      setNewLabel('');
      setSuccessMsg(`"${newLabel.trim()}" added successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    setDeleting(sectionId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const result = await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'delete_section',
          sectionId,
        }),
      });
      setDeleteConfirmId(null);
      setSuccessMsg(`Section deleted. ${result.deletedVideos || 0} video(s) removed.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalCard, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>MANAGE SECTIONS</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <p style={{ color: '#888', fontSize: 12, marginBottom: 16, lineHeight: '1.5' }}>
          Add or remove sub-categories across all 3 main portfolio tabs.
          <strong style={{ color: '#FF3B30' }}> Deleting a section will permanently remove all its videos from Azure.</strong>
        </p>

        {errorMsg && (
          <div style={{ color: '#FF3B30', fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: 'bold', padding: '8px 12px', background: 'rgba(255,59,48,0.08)', borderRadius: 8, border: '1px solid rgba(255,59,48,0.2)' }}>
            ✕ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ color: '#2D8B4E', fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: 'bold', padding: '8px 12px', background: 'rgba(45,139,78,0.08)', borderRadius: 8, border: '1px solid rgba(45,139,78,0.2)' }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Existing Sections List grouped by category */}
        <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: 20, paddingRight: 4 }}>
          {CATEGORY_GROUPS.map(group => {
            const groupSections = sections.filter(s => s.group === group);
            if (groupSections.length === 0) return null;
            return (
              <div key={group} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: '#555', marginBottom: 8, textTransform: 'uppercase' }}>
                  {group} ({groupSections.length})
                </div>
                {groupSections.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#1A1A1A', borderRadius: 8, border: '1px solid #2A2A2A', marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, flex: 1 }}>{s.label}</span>
                    <span style={{ color: '#444', fontSize: 10, fontFamily: 'monospace' }}>{s.id}</span>
                    {deleteConfirmId === s.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          disabled={deleting === s.id}
                          onClick={() => handleDeleteSection(s.id)}
                          style={{ padding: '4px 10px', background: '#FF3B30', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}
                        >
                          {deleting === s.id ? '...' : 'YES, DELETE'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          style={{ padding: '4px 10px', background: '#333', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                        >
                          CANCEL
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(s.id)}
                        style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#555', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF3B30'; e.currentTarget.style.color = '#FF3B30'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#555'; }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Add New Section Form */}
        <div style={{ padding: 16, background: '#141414', borderRadius: 12, border: '1px solid #222' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#888', marginBottom: 12 }}>+ ADD NEW SUB-CATEGORY</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={styles.label}>NAME</label>
              <input
                style={styles.input}
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="e.g. Sports & Fitness"
              />
            </div>
            <div>
              <label style={styles.label}>PARENT CATEGORY</label>
              <select
                style={styles.select}
                value={newGroup}
                onChange={e => setNewGroup(e.target.value)}
              >
                {CATEGORY_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <label style={styles.label}>COLOR</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {colorPresets.map(c => (
              <div
                key={c}
                onClick={() => setNewColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                  border: newColor === c ? '2px solid #fff' : '2px solid transparent',
                  boxShadow: newColor === c ? `0 0 8px ${c}` : 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
            <input
              type="color"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              title="Custom color"
            />
          </div>

          {newLabel.trim() && (
            <div style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>
              ID: <code style={{ color: '#888', background: '#0D0D0D', padding: '2px 6px', borderRadius: 4 }}>{generateId(newLabel)}</code>
            </div>
          )}

          <button
            onClick={handleAddSection}
            disabled={saving || !newLabel.trim()}
            style={{
              ...styles.primaryBtn,
              marginTop: 4,
              opacity: saving || !newLabel.trim() ? 0.4 : 1,
            }}
          >
            {saving ? 'ADDING...' : 'ADD SUB-CATEGORY'}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{ ...styles.primaryBtn, marginTop: 16, background: '#333' }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── DASHBOARD ───────────────────── */
function Dashboard({ onLogout }) {
  const [videos, setVideos] = useState([]);
  const [domainThumbnails, setDomainThumbnails] = useState({});
  const [customSections, setCustomSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showDomainSettings, setShowDomainSettings] = useState(false);
  const [showManageSections, setShowManageSections] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Merge default + custom sections
  const SECTIONS = mergeSections(customSections);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchJson(`${API_BASE}/videos`);
      setVideos(data.videos || []);
      setDomainThumbnails(data.domainThumbnails || {});
      setCustomSections(data.customSections || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleDelete = async (id) => {
    try {
      await fetchJson(`${API_BASE}/videos`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ id }),
      });
      setDeleteConfirm(null);
      fetchVideos();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleChangeSection = async (videoId, newSection) => {
    try {
      await fetchJson(`${API_BASE}/videos`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          action: 'change_section',
          videoId,
          newSection,
        }),
      });
      fetchVideos(); // Refresh the video list
    } catch (err) {
      console.error('Change section error:', err);
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
          <p style={styles.dashSub}>{videos.length} videos across {SECTIONS.length} sections{customSections.length > 0 ? ` (${customSections.length} custom)` : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowManageSections(true)} 
            style={{ ...styles.logoutBtn, borderColor: '#D998FF', color: '#D998FF', marginRight: 4 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.borderColor = '#D998FF';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(217, 152, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(217, 152, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = '#D998FF';
              e.currentTarget.style.color = '#D998FF';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            SECTIONS
          </button>
          <button 
            onClick={() => setShowDomainSettings(true)} 
            style={{ ...styles.logoutBtn, borderColor: '#00D4FF', color: '#00D4FF', marginRight: 4 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.borderColor = '#00D4FF';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = '#00D4FF';
              e.currentTarget.style.color = '#00D4FF';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            DOMAINS
          </button>
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
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          style={{ ...styles.videoThumb, objectFit: 'cover' }}
                        />
                      ) : (
                        <LazyVideo
                          src={video.videoUrl}
                          style={styles.videoThumb}
                          isPaused={playingId !== null}
                        />
                      )}
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
                    <select
                      value={video.section}
                      onChange={(e) => handleChangeSection(video.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: '#1A1A1A',
                        color: sectionInfo?.color || '#888',
                        border: '1px solid #2A2A2A',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '1px',
                        padding: '3px 6px',
                        cursor: 'pointer',
                        outline: 'none',
                        maxWidth: 160,
                        appearance: 'auto',
                      }}
                    >
                      {(() => {
                        const secs = SECTIONS;
                        const groups = [...new Set(secs.map(s => s.group))];
                        return groups.map(group => (
                          <optgroup key={group} label={group}>
                            {secs.filter(s => s.group === group).map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </optgroup>
                        ));
                      })()}
                    </select>
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
          sections={SECTIONS}
        />
      )}

      {/* Domain Thumbnails Modal */}
      {showDomainSettings && (
        <DomainThumbnailsModal
          domainThumbnails={domainThumbnails}
          onClose={() => setShowDomainSettings(false)}
          onUpdated={fetchVideos}
          sections={SECTIONS}
        />
      )}

      {/* Manage Sections Modal */}
      {showManageSections && (
        <ManageSectionsModal
          sections={SECTIONS}
          onClose={() => setShowManageSections(false)}
          onUpdated={fetchVideos}
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
  thumbnailZone: {
    border: '1px dashed #333',
    borderRadius: 8,
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 56,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

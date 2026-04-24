import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUpload, FaTimes, FaVideo, FaEdit, FaPlay, FaFilter } from 'react-icons/fa';
import { getVideos, deleteVideo, updateVideo } from '../api';
import { API_BASE } from '../../utils/api';

const VIDEO_CATEGORIES = ['All', 'Infrastructure', 'Campus Tour', 'Facilities', 'Classrooms', 'Labs', 'Play Area'];

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

/* ─ Tiny shared styles ─ */
const inp = { padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: 'white', width: '100%' };
const btn = (bg, color = 'white') => ({ background: bg, color, border: 'none', borderRadius: '0.5rem', padding: '0.55rem 1rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' });

const VideosView = ({ pageVariants, globalSearch = '' }) => {
  const qc = useQueryClient();
  const [filterCat, setFilterCat] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    setFilterSearch(globalSearch || '');
  }, [globalSearch]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });
  const [playingVideo, setPlayingVideo] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filterSearch), 400);
    return () => clearTimeout(t);
  }, [filterSearch]);

  const filters = { search: debouncedSearch, category: filterCat };
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', filters],
    queryFn: () => getVideos(filters),
    keepPreviousData: true,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['videos'] });
    qc.invalidateQueries({ queryKey: ['adminStats'] });
  };

  const delMut = useMutation({ mutationFn: deleteVideo, onSuccess: invalidate });
  const editMut = useMutation({ mutationFn: updateVideo, onSuccess: () => { invalidate(); setEditItem(null); } });

  const shown = data?.data ?? [];
  const total = data?.pagination?.total ?? shown.length;

  // Upload helpers
  const onFilePick = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(prev => [
      ...prev,
      ...files.map(f => ({
        file: f,
        preview: URL.createObjectURL(f),
        title: f.name.replace(/\.[^/.]+$/, ''),
        description: '',
        category: 'Infrastructure',
        status: 'pending'
      }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeQueued = (idx) => setUploadFiles(prev => prev.filter((_, i) => i !== idx));
  const updateQueued = (idx, field, val) => setUploadFiles(prev => prev.map((f, i) => i === idx ? { ...f, [field]: val } : f));
  const applyToAll = (field, val) => setUploadFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, [field]: val } : f));

  const runBulkUpload = async () => {
    if (!uploadFiles.length) return;
    setUploading(true);
    for (let i = 0; i < uploadFiles.length; i++) {
      const entry = uploadFiles[i];
      if (entry.status === 'done') continue;
      setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));
      try {
        await uploadVideo(entry.file, {
          title: entry.title,
          description: entry.description,
          category: entry.category
        });
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done' } : f));
      } catch {
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }
    setUploading(false);
    invalidate();
  };

  const closeUpload = () => { setUploadFiles([]); setUploadOpen(false); };

  // Edit helpers
  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({ title: item.title || '', description: item.description || '', category: item.category || 'Infrastructure' });
  };
  const submitEdit = (e) => { e.preventDefault(); editMut.mutate({ id: editItem._id, ...editForm }); };

  const statusBadge = { pending: '#94a3b8', uploading: '#3b82f6', done: '#16a34a', error: '#dc2626' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

      {/* ── Toolbar ── */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaVideo style={{ color: '#ef4444', fontSize: '1.1rem' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Video Gallery</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{isLoading ? '…' : `${total} videos`}</span>
        </div>
        <button onClick={() => setUploadOpen(true)} style={btn('#7c3aed')}>
          <FaUpload size={12} /> Upload Videos
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: '#fafafa' }}>
        <FaFilter style={{ color: '#94a3b8', fontSize: '0.85rem' }} />
        <input placeholder="Search videos…" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} style={{ ...inp, width: '180px' }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: '150px' }}>
          {VIDEO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: '1.25rem' }}>
        {isLoading && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading videos…</p>}
        {error && <p style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>Error: {error.message}</p>}
        {!isLoading && !error && shown.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No videos found. Upload some videos to get started.</p>
        )}
        {!isLoading && !error && shown.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {shown.map(item => (
              <div key={item._id} style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', background: '#f1f5f9', border: '2px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,.06)', transition: 'border-color .2s, box-shadow .2s' }}>
                {/* Video Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0f172a', cursor: 'pointer' }} onClick={() => setPlayingVideo(item)}>
                  <img src={item.thumbnailUrl || item.url.replace(/\.[^/.]+$/, '.jpg')} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                      <FaPlay style={{ color: '#7c3aed', fontSize: '1.5rem', marginLeft: '4px' }} />
                    </div>
                  </div>
                  {item.duration > 0 && (
                    <span style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                      {formatDuration(item.duration)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.75rem' }}>{item.category} · {formatFileSize(item.size)}</p>
                </div>

                {/* Actions */}
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                  <button onClick={() => openEdit(item)} title="Edit" style={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.3rem 0.4rem', cursor: 'pointer', color: '#3b82f6' }}>
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => { if (window.confirm('Delete this video?')) delMut.mutate(item._id); }} title="Delete" style={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.3rem 0.4rem', cursor: 'pointer', color: '#dc2626' }}>
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════ UPLOAD MODAL ══════════════ */}
      <AnimatePresence>
        {uploadOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,.3)' }}>

              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <FaVideo style={{ color: '#7c3aed' }} /> Upload Videos
                </h3>
                <button onClick={closeUpload} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
              </div>

              <div style={{ padding: '1rem 1.25rem', flexShrink: 0 }}>
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #c4b5fd', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: '#faf5ff' }}>
                  <FaUpload style={{ fontSize: '1.75rem', color: '#7c3aed', marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, color: '#6d28d9', fontWeight: 600, fontSize: '0.9rem' }}>Click to select videos</p>
                  <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>MP4, WebM, MOV up to 100MB</p>
                  <input ref={fileInputRef} type="file" multiple accept="video/*" onChange={onFilePick} style={{ display: 'none' }} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
                {uploadFiles.length > 0 && (
                  <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', background: '#fafafa', margin: '0 -1.25rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Apply to all:</span>
                    <select onChange={e => applyToAll('category', e.target.value)} defaultValue="" style={{ ...inp, fontSize: '0.75rem', width: '140px' }}>
                      <option value="" disabled>Category</option>
                      {VIDEO_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                {uploadFiles.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '1rem 0' }}>No videos added yet.</p>}
                {uploadFiles.map((entry, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 36px', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <video src={entry.preview} style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '0.4rem' }} />
                    <input value={entry.title} onChange={e => updateQueued(idx, 'title', e.target.value)} placeholder="Title" style={{ ...inp, fontSize: '0.8rem' }} disabled={entry.status !== 'pending'} />
                    <select value={entry.category} onChange={e => updateQueued(idx, 'category', e.target.value)} style={{ ...inp, fontSize: '0.8rem' }} disabled={entry.status !== 'pending'}>
                      {VIDEO_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                    {entry.status === 'pending' ? (
                      <button onClick={() => removeQueued(idx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FaTimes /></button>
                    ) : (
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusBadge[entry.status], display: 'inline-block', margin: '0 auto' }} title={entry.status} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                <button onClick={closeUpload} style={btn('#e2e8f0', '#475569')}>Cancel</button>
                <button onClick={runBulkUpload} disabled={uploading || uploadFiles.length === 0} style={{ ...btn('#7c3aed'), opacity: (uploading || uploadFiles.length === 0) ? 0.55 : 1 }}>
                  <FaUpload size={12} />
                  {uploading ? 'Uploading…' : `Upload ${uploadFiles.length} video${uploadFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════ EDIT MODAL ══════════════ */}
      <AnimatePresence>
        {editItem && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,.3)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaEdit style={{ color: '#3b82f6' }} /> Edit Video
                </h3>
                <button onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
              </div>
              <form onSubmit={submitEdit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
                  Title *
                  <input required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inp} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
                  Description
                  <textarea rows={2} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ ...inp, resize: 'vertical' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
                  Category
                  <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={inp}>
                    {VIDEO_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                  <button type="button" onClick={() => setEditItem(null)} style={btn('#e2e8f0', '#475569')}>Cancel</button>
                  <button type="submit" disabled={editMut.isPending} style={{ ...btn('#3b82f6'), opacity: editMut.isPending ? 0.6 : 1 }}>
                    {editMut.isPending ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════ VIDEO PLAYER MODAL ══════════════ */}
      <AnimatePresence>
        {playingVideo && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(8px)', padding: '1rem' }} onClick={() => setPlayingVideo(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ width: '100%', maxWidth: '960px', borderRadius: '0.75rem', overflow: 'hidden', background: '#0f172a' }} onClick={e => e.stopPropagation()}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setPlayingVideo(null)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaTimes />
                </button>
                <video src={playingVideo.url} controls autoPlay style={{ width: '100%', aspectRatio: '16/9', display: 'block' }} poster={playingVideo.thumbnailUrl} />
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{playingVideo.title}</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{playingVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Inline upload function for this component
async function uploadVideo(file, metadata) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('category', metadata.category);
  
  const res = await fetch(`${API_BASE}/api/videos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export default VideosView;

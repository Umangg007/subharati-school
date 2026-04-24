import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaUpload, FaTimes, FaImages, FaEdit, FaCheck, FaFilter, FaLayerGroup } from 'react-icons/fa';
import { getGallery, createGallery, deleteGallery, updateGallery, bulkDeleteGallery } from '../api';
import { API_BASE, resolveMediaUrl } from '../../utils/api';

const SECTIONS = ['Pre-primary', 'Primary'];
const CATEGORIES = ['Uncategorized', 'Festival', 'Sports', 'Annual Function', 'Campus', 'Happy faces'];

const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    body: fd,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Upload failed'); }
  return res.json();
};

/* ─ Tiny shared input/select style ─ */
const inp = { padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: 'white', width: '100%' };
const btn = (bg, color = 'white') => ({ background: bg, color, border: 'none', borderRadius: '0.5rem', padding: '0.55rem 1rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' });

const GalleryView = ({ pageVariants, globalSearch = '' }) => {
  const qc = useQueryClient();

  /* ── filter state ── */
  const [filterCat, setFilterCat] = useState('All');
  const [filterSec, setFilterSec] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');
  // Debounced search — only fire the query after 400 ms of inactivity
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    setFilterSearch(globalSearch || '');
  }, [globalSearch]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filterSearch), 400);
    return () => clearTimeout(t);
  }, [filterSearch]);

  /* ── selection state ── */
  const [selected, setSelected] = useState(new Set());

  /* ── upload modal state ── */
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  /* ── edit modal state ── */
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', section: '' });

  // Query key includes filter params so React Query re-fetches whenever they change.
  // Backend handles: ?search= (title|description|caption), ?category= (exact, skipped if 'All'), ?section= (exact)
  const filters = { search: debouncedSearch, category: filterCat, section: filterSec === 'All' ? '' : filterSec };
  const { data, isLoading, error } = useQuery({
    queryKey: ['gallery', filters],
    queryFn: () => getGallery({ page: 1, limit: 100, ...filters }),
    keepPreviousData: true,
  });

  // Reset selection whenever the results change
  useEffect(() => { setSelected(new Set()); }, [data]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['gallery'] });
    qc.invalidateQueries({ queryKey: ['adminStats'] });
  };

  const delMut = useMutation({ mutationFn: deleteGallery, onSuccess: invalidate });
  const editMut = useMutation({ mutationFn: updateGallery, onSuccess: () => { invalidate(); setEditItem(null); } });
  const bulkMut = useMutation({ mutationFn: bulkDeleteGallery, onSuccess: () => { invalidate(); setSelected(new Set()); } });
  const createMut = useMutation({ mutationFn: createGallery, onSuccess: invalidate });

  // All items come pre-filtered from the server
  const shown = data?.data ?? [];
  const total = data?.pagination?.total ?? shown.length;

  /* ── selection helpers ── */
  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelected(new Set(shown.map(i => i._id)));
  const clearSel = () => setSelected(new Set());
  const allChecked = shown.length > 0 && shown.every(i => selected.has(i._id));

  /* ── bulk upload helpers ── */
  const onFilePick = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(prev => [
      ...prev,
      ...files.map(f => ({ file: f, preview: URL.createObjectURL(f), title: f.name.replace(/\.[^/.]+$/, ''), category: 'Uncategorized', section: 'Primary', status: 'pending' }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeQueued = (idx) => setUploadFiles(prev => prev.filter((_, i) => i !== idx));
  const updateQueued = (idx, field, val) => setUploadFiles(prev => prev.map((f, i) => i === idx ? { ...f, [field]: val } : f));

  // Apply category/section to all pending items
  const applyToAll = (field, val) => {
    setUploadFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, [field]: val } : f));
  };

  const runBulkUpload = async () => {
    if (!uploadFiles.length) return;
    setUploading(true);
    for (let i = 0; i < uploadFiles.length; i++) {
      const entry = uploadFiles[i];
      if (entry.status === 'done') continue;
      setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));
      try {
        const up = await uploadImage(entry.file);
        await createMut.mutateAsync({ title: entry.title, category: entry.category, section: entry.section, imageUrl: up.url });
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done' } : f));
      } catch {
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }
    setUploading(false);
    invalidate();
  };

  const closeUpload = () => { setUploadFiles([]); setUploadOpen(false); };

  /* ── edit helpers ── */
  const openEdit = (item) => { setEditItem(item); setEditForm({ title: item.title || item.caption || '', description: item.description || '', category: item.category || 'Uncategorized', section: item.section || 'Primary' }); };
  const submitEdit = (e) => { e.preventDefault(); editMut.mutate({ id: editItem._id, ...editForm }); };

  const resolveImg = (item) => resolveMediaUrl(item.imageUrl || item.url || item.resolvedImageUrl || '');

  /* ── status badge ── */
  const statusBadge = { pending: '#94a3b8', uploading: '#3b82f6', done: '#16a34a', error: '#dc2626' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

      {/* ── Toolbar ── */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaImages style={{ color: '#f59e0b', fontSize: '1.1rem' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Media Gallery</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{isLoading ? '…' : `${total} items`}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {selected.size > 0 && (
            <button onClick={() => { if (window.confirm(`Delete ${selected.size} item(s)?`)) bulkMut.mutate([...selected]); }}
              style={btn('#dc2626')} disabled={bulkMut.isPending}>
              <FaTrash size={12} /> Delete {selected.size}
            </button>
          )}
          <button onClick={() => setUploadOpen(true)} style={btn('#7c3aed')}>
            <FaUpload size={12} /> Bulk Upload
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: '#fafafa' }}>
        <FaFilter style={{ color: '#94a3b8', fontSize: '0.85rem' }} />
        <input placeholder="Search title…" value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
          style={{ ...inp, width: '180px' }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: '150px' }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterSec} onChange={e => setFilterSec(e.target.value)} style={{ ...inp, width: '150px' }}>
          <option value="All">All Sections</option>
          {SECTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={allChecked} onChange={allChecked ? clearSel : selectAll}
            style={{ width: '16px', height: '16px', accentColor: '#7c3aed', cursor: 'pointer' }} />
          Select all {shown.length > 0 ? `(${shown.length})` : ''}
        </label>
        {selected.size > 0 && (
          <button onClick={clearSel} style={{ ...btn('#e2e8f0', '#475569'), fontSize: '0.8rem' }}>Clear</button>
        )}
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: '1.25rem' }}>
        {isLoading && <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading gallery…</p>}
        {error && <p style={{ textAlign: 'center', color: '#dc2626', padding: '2rem' }}>Error: {error.message}</p>}
        {!isLoading && !error && shown.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No items match your filters.</p>
        )}
        {!isLoading && !error && shown.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {shown.map(item => {
              const isSelected = selected.has(item._id);
              return (
                <div key={item._id} style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', aspectRatio: '1', background: '#f1f5f9', border: `2px solid ${isSelected ? '#7c3aed' : '#e2e8f0'}`, boxShadow: isSelected ? '0 0 0 3px rgba(124,58,237,0.2)' : '0 2px 6px rgba(0,0,0,.06)', transition: 'border-color .2s, box-shadow .2s' }}>
                  <img src={resolveImg(item)} alt={item.title || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />

                  {/* Checkbox top-left */}
                  <div onClick={() => toggle(item._id)} style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', width: '22px', height: '22px', borderRadius: '5px', background: isSelected ? '#7c3aed' : 'rgba(255,255,255,0.9)', border: `2px solid ${isSelected ? '#7c3aed' : '#cbd5e1'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', zIndex: 10 }}>
                    {isSelected && <FaCheck size={11} color="white" />}
                  </div>

                  {/* Edit + Delete top-right */}
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem', zIndex: 10 }}>
                    <button onClick={() => openEdit(item)} title="Edit"
                      style={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.3rem 0.4rem', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this image?')) delMut.mutate(item._id); }} title="Delete"
                      style={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.3rem 0.4rem', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                      <FaTrash size={12} />
                    </button>
                  </div>

                  {/* Bottom label */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 100%)', padding: '1.25rem 0.5rem 0.5rem', pointerEvents: 'none' }}>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || item.caption || '—'}</p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,.65)', fontSize: '0.65rem' }}>{item.category} · {item.section}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════ BULK UPLOAD MODAL ══════════════ */}
      <AnimatePresence>
        {uploadOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,.3)' }}>

              {/* Modal header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <FaLayerGroup style={{ color: '#7c3aed' }} /> Bulk Upload
                </h3>
                <button onClick={closeUpload} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
              </div>

              {/* Drop zone */}
              <div style={{ padding: '1rem 1.25rem', flexShrink: 0 }}>
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #c4b5fd', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: '#faf5ff', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3e8ff'}
                  onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}>
                  <FaUpload style={{ fontSize: '1.75rem', color: '#7c3aed', marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, color: '#6d28d9', fontWeight: 600, fontSize: '0.9rem' }}>Click to pick images (or multiple)</p>
                  <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>PNG, JPG, WebP, GIF accepted</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={onFilePick} style={{ display: 'none' }} />
                </div>
              </div>

              {/* Queue list */}
              <div className="table-responsive" style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
                <div style={{ minWidth: '600px' }}>
                  {uploadFiles.length > 0 && (
                    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', background: '#fafafa', margin: '0 -1.25rem', paddingLeft: '1.25rem', paddingRight: '1.25rem', marginLeft: '-1.25rem', marginRight: '-1.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Apply to all:</span>
                      <select onChange={e => applyToAll('category', e.target.value)} defaultValue="" style={{ ...inp, fontSize: '0.75rem', width: '120px' }}>
                        <option value="" disabled>Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select onChange={e => applyToAll('section', e.target.value)} defaultValue="" style={{ ...inp, fontSize: '0.75rem', width: '120px' }}>
                        <option value="" disabled>Section</option>
                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  {uploadFiles.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '1rem 0' }}>No images added yet.</p>
                  )}
                  {uploadFiles.map((entry, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '52px 1fr 130px 130px 36px', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      {/* Preview */}
                      <img src={entry.preview} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.4rem', border: '1px solid #e2e8f0' }} />
                      {/* Title */}
                      <input value={entry.title} onChange={e => updateQueued(idx, 'title', e.target.value)}
                        placeholder="Title" style={{ ...inp, fontSize: '0.8rem' }} disabled={entry.status !== 'pending'} />
                      {/* Category */}
                      <select value={entry.category} onChange={e => updateQueued(idx, 'category', e.target.value)} style={{ ...inp, fontSize: '0.8rem' }} disabled={entry.status !== 'pending'}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {/* Section */}
                      <select value={entry.section} onChange={e => updateQueued(idx, 'section', e.target.value)} style={{ ...inp, fontSize: '0.8rem' }} disabled={entry.status !== 'pending'}>
                        {SECTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {/* Status / remove */}
                      {entry.status === 'pending' ? (
                        <button onClick={() => removeQueued(idx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}><FaTimes /></button>
                      ) : (
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusBadge[entry.status], display: 'inline-block', margin: '0 auto' }} title={entry.status} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                <button onClick={closeUpload} style={btn('#e2e8f0', '#475569')}>Cancel</button>
                <button onClick={runBulkUpload} disabled={uploading || uploadFiles.length === 0}
                  style={{ ...btn('#7c3aed'), opacity: (uploading || uploadFiles.length === 0) ? 0.55 : 1 }}>
                  <FaUpload size={12} />
                  {uploading ? `Uploading…` : `Upload ${uploadFiles.length} image${uploadFiles.length !== 1 ? 's' : ''}`}
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
                  <FaEdit style={{ color: '#3b82f6' }} /> Edit Image
                </h3>
                <button onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem', background: '#f8fafc' }}>
                <img src={resolveImg(editItem)} alt="" style={{ height: '120px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
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
                <div className="admin-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
                    Category
                    <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={inp}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>
                    Section
                    <select value={editForm.section} onChange={e => setEditForm({ ...editForm, section: e.target.value })} style={inp}>
                      {SECTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
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
    </motion.div>
  );
};

export default GalleryView;

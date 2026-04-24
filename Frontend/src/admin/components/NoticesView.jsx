import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaTimes, FaNewspaper } from 'react-icons/fa';
import { getNotices, createNotice, deleteNotice } from '../api';

// Backend ALLOWED_TAGS from Notice model
const TAGS = ['General', 'Academic', 'Holiday', 'Exam'];

const NoticesView = ({ pageVariants, globalSearch = '' }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen]   = useState(false);
  const [form, setForm]       = useState({ title: '', description: '', tag: 'General', publishedBy: 'Admin Desk' });
  const [errors, setErrors]   = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notices'],
    queryFn: () => getNotices(1, 100),
  });

  const delMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setIsOpen(false);
      setForm({ title: '', description: '', tag: 'General', publishedBy: 'Admin Desk' });
      setErrors([]);
    },
    onError: (err) => setErrors([err.message]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    createMutation.mutate(form);
  };

  const notices = data?.data ?? [];
  const effectiveSearch = globalSearch.trim().toLowerCase();
  const visibleNotices = effectiveSearch
    ? notices.filter((n) =>
        (n.title || '').toLowerCase().includes(effectiveSearch) ||
        (n.description || '').toLowerCase().includes(effectiveSearch) ||
        (n.tag || '').toLowerCase().includes(effectiveSearch) ||
        (n.publishedBy || '').toLowerCase().includes(effectiveSearch)
      )
    : notices;

  const tagColor = { General: '#64748b', Academic: '#2563eb', Holiday: '#16a34a', Exam: '#d97706' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaNewspaper style={{ color: '#d97706' }} /> Notice Board
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{visibleNotices.length} notices published</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
        >
          <FaPlus size={12} /> Add Notice
        </button>
      </div>

      {isLoading && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading notices…</div>}
      {error    && <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>Error: {error.message}</div>}

      {!isLoading && !error && (
        <>
          {/* Table - Desktop */}
          <div className="table-responsive">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Date', 'Title', 'Tag', 'Published By', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleNotices.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No notices yet. Add one above.</td></tr>
                ) : visibleNotices.map(n => (
                  <tr key={n._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(n.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1e293b' }}>
                      {n.title}
                      {n.isNew && (
                        <span style={{ marginLeft: '0.4rem', background: '#fee2e2', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          New
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ background: (tagColor[n.tag] || '#64748b') + '18', color: tagColor[n.tag] || '#64748b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {n.tag}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{n.publishedBy}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button
                        onClick={() => window.confirm('Delete this notice?') && delMutation.mutate(n._id)}
                        style={{ background: '#fef2f2', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {visibleNotices.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No notices yet. Add one above.</div>
            ) : visibleNotices.map(n => (
              <div key={n._id} className="mobile-card">
                <div className="mobile-card-header">
                  <div className="mobile-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {n.title}
                    {n.isNew && (
                      <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.3rem', borderRadius: '999px', textTransform: 'uppercase' }}>New</span>
                    )}
                  </div>
                  <div className="mobile-card-date">{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Tag</span>
                    <span className="mobile-tag" style={{ background: (tagColor[n.tag] || '#64748b') + '18', color: tagColor[n.tag] || '#64748b' }}>
                      {n.tag}
                    </span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Published By</span>
                    <span className="mobile-card-value">{n.publishedBy}</span>
                  </div>
                </div>
                <div className="mobile-card-footer">
                  <span style={{ background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>Active</span>
                  <button
                    onClick={() => window.confirm('Delete this notice?') && delMutation.mutate(n._id)}
                    className="mobile-card-btn delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)' }}
            >
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b' }}>Publish New Notice</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {errors.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {errors.join(' • ')}
                  </div>
                )}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Title *
                  <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Description *
                  <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                  />
                </label>
                <div className="admin-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Tag
                    <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                    >
                      {TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Published By
                    <input type="text" value={form.publishedBy} onChange={e => setForm({ ...form, publishedBy: e.target.value })}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </label>
                </div>
                <button type="submit" disabled={createMutation.isPending}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: createMutation.isPending ? 0.6 : 1 }}
                >
                  {createMutation.isPending ? 'Publishing…' : 'Publish Notice'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoticesView;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaTimes, FaCalendarAlt, FaUpload, FaSpinner } from 'react-icons/fa';
import { getEvents, createEvent, deleteEvent, uploadFile } from '../api';

// Backend categories from Event model
const CATEGORIES = ['General', 'Academic', 'Sports', 'Cultural'];

const EventsView = ({ pageVariants, globalSearch = '' }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', category: 'General', imageUrl: '' });
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.url) setForm({ ...form, imageUrl: res.url });
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setUploading(false);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(1, 100),
  });

  const delMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setIsOpen(false);
      setForm({ title: '', description: '', date: '', time: '', venue: '', category: 'General', imageUrl: '' });
      setErrors([]);
    },
    onError: (err) => setErrors([err.message]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    createMutation.mutate(form);
  };

  const events = data?.data ?? [];
  const effectiveSearch = globalSearch.trim().toLowerCase();
  const visibleEvents = effectiveSearch
    ? events.filter((ev) =>
        (ev.title || '').toLowerCase().includes(effectiveSearch) ||
        (ev.description || '').toLowerCase().includes(effectiveSearch) ||
        (ev.venue || '').toLowerCase().includes(effectiveSearch) ||
        (ev.category || '').toLowerCase().includes(effectiveSearch)
      )
    : events;

  const catColor = { General: '#64748b', Academic: '#2563eb', Sports: '#16a34a', Cultural: '#d97706' };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaCalendarAlt style={{ color: '#16a34a' }} /> Events
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{visibleEvents.length} events listed</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
        >
          <FaPlus size={12} /> Add Event
        </button>
      </div>

      {isLoading && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading events…</div>}
      {error    && <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>Error: {error.message}</div>}

      {!isLoading && !error && (
        <>
          {/* Table - Desktop */}
          <div className="table-responsive">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Title', 'Date', 'Time', 'Venue', 'Category', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleEvents.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No events yet. Add one above.</td></tr>
                ) : visibleEvents.map(ev => (
                  <tr key={ev._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1e293b' }}>{ev.title}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {new Date(ev.date).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{ev.time}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{ev.venue}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        background: catColor[ev.category] + '18',
                        color: catColor[ev.category] || '#64748b',
                        padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {ev.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button
                        onClick={() => window.confirm('Delete this event?') && delMutation.mutate(ev._id)}
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
            {visibleEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No events yet. Add one above.</div>
            ) : visibleEvents.map(ev => (
              <div key={ev._id} className="mobile-card">
                <div className="mobile-card-header">
                  <div className="mobile-card-title">{ev.title}</div>
                  <span className="mobile-tag" style={{ background: catColor[ev.category] + '18', color: catColor[ev.category] || '#64748b' }}>
                    {ev.category}
                  </span>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Date</span>
                    <span className="mobile-card-value">{new Date(ev.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Time</span>
                    <span className="mobile-card-value">{ev.time}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Venue</span>
                    <span className="mobile-card-value">{ev.venue}</span>
                  </div>
                </div>
                <div className="mobile-card-footer">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}></span>
                  <button
                    onClick={() => window.confirm('Delete this event?') && delMutation.mutate(ev._id)}
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
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)' }}
            >
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b' }}>Add New Event</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {errors.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem', color: '#dc2626', fontSize: '0.875rem' }}>
                    {errors.join(' • ')}
                  </div>
                )}
                {[
                  { label: 'Title *', key: 'title', type: 'text' },
                  { label: 'Description *', key: 'description', type: 'textarea' },
                ].map(({ label, key, type }) => (
                  <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    {label}
                    {type === 'textarea' ? (
                      <textarea required rows={3} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                      />
                    ) : (
                      <input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                      />
                    )}
                  </label>
                ))}
                <div className="admin-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Date *
                    <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Time *
                    <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </label>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Venue *
                  <input required type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Category
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Event Image (Optional)
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} id="event-image-upload" />
                    <label htmlFor="event-image-upload" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem' }}>
                      {uploading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FaSpinner /></motion.div>
                      ) : <FaUpload />}
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </label>
                    {form.imageUrl && (
                      <img src={form.imageUrl} alt="Preview" style={{ height: '38px', width: '38px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                    )}
                  </div>
                </label>
                <button type="submit" disabled={createMutation.isPending}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem', opacity: createMutation.isPending ? 0.6 : 1 }}
                >
                  {createMutation.isPending ? 'Saving…' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventsView;

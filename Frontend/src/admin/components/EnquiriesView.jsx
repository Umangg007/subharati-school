import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch, FaEnvelope } from 'react-icons/fa';
import { getEnquiries, deleteEnquiry, updateEnquiryStatus } from '../api';

const STATUS_COLORS = {
  Pending: { bg: '#fff7ed', text: '#c2410c' },
  Replied: { bg: '#f0f9ff', text: '#0369a1' },
  Closed: { bg: '#f1f5f9', text: '#475569' }
};

const EnquiriesView = ({ pageVariants, globalSearch = '' }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => getEnquiries(1, 100),
  });

  const delMutation = useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
  });

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading enquiries…</div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>Error: {error.message}</div>;

  const all = data?.data ?? [];
  const effectiveSearch = (search.trim() || globalSearch.trim()).toLowerCase();
  const rows = effectiveSearch
    ? all.filter(e =>
      (e.name || '').toLowerCase().includes(effectiveSearch) ||
      (e.email || '').toLowerCase().includes(effectiveSearch)
    )
    : all;

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="section-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaEnvelope style={{ color: '#3b82f6' }} /> Enquiries
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{all.length} total records</p>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Date', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No enquiries found.</td></tr>
            ) : rows.map((enq) => (
              <tr key={enq._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1e293b' }}>{enq.name}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>
                  <a href={`mailto:${enq.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{enq.email}</a>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{enq.phone || '—'}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569', maxWidth: '220px' }}>
                  <span
                    style={{ cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: expanded === enq._id ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    onClick={() => setExpanded(expanded === enq._id ? null : enq._id)}
                    title="Click to expand"
                  >
                    {enq.message}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <select
                    value={enq.status || 'Pending'}
                    onChange={(e) => statusMutation.mutate({ id: enq._id, status: e.target.value })}
                    disabled={statusMutation.isPending}
                    style={{
                      background: (STATUS_COLORS[enq.status || 'Pending'] || STATUS_COLORS.Pending).bg,
                      color: (STATUS_COLORS[enq.status || 'Pending'] || STATUS_COLORS.Pending).text,
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <button
                    onClick={() => window.confirm('Delete this enquiry?') && delMutation.mutate(enq._id)}
                    disabled={delMutation.isPending}
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
        {rows.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No enquiries found.</div>
        ) : rows.map((enq) => (
          <div key={enq._id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">{enq.name}</div>
              <div className="mobile-card-date">{new Date(enq.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Email</span>
                <span className="mobile-card-value">{enq.email}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Phone</span>
                <span className="mobile-card-value">{enq.phone || '—'}</span>
              </div>
              <div className="mobile-card-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                <span className="mobile-card-label">Message</span>
                <span style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>{enq.message}</span>
              </div>
            </div>
            <div className="mobile-card-footer">
              <select
                value={enq.status || 'Pending'}
                onChange={(e) => statusMutation.mutate({ id: enq._id, status: e.target.value })}
                disabled={statusMutation.isPending}
                style={{
                  background: (STATUS_COLORS[enq.status || 'Pending'] || STATUS_COLORS.Pending).bg,
                  color: (STATUS_COLORS[enq.status || 'Pending'] || STATUS_COLORS.Pending).text,
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                onClick={() => window.confirm('Delete this enquiry?') && delMutation.mutate(enq._id)}
                disabled={delMutation.isPending}
                className="mobile-card-btn delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EnquiriesView;

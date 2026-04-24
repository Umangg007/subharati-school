import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch, FaUserGraduate } from 'react-icons/fa';
import { getAdmissions, deleteAdmission, updateAdmissionStatus } from '../api';

const STATUS_COLORS = {
  Pending: { bg: '#fff7ed', text: '#c2410c' },
  Reviewed: { bg: '#f0f9ff', text: '#0369a1' },
  Accepted: { bg: '#f0fdf4', text: '#15803d' },
  Rejected: { bg: '#fef2f2', text: '#b91c1c' }
};

const AdmissionsView = ({ pageVariants, globalSearch = '' }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admissions'],
    queryFn: () => getAdmissions(1, 100),
  });

  const delMutation = useMutation({
    mutationFn: deleteAdmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateAdmissionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });

  if (isLoading) return <div className="p-8 text-center" style={{ color: '#64748b' }}>Loading admissions…</div>;
  if (error) return <div className="p-8 text-center" style={{ color: '#dc2626' }}>Error: {error.message}</div>;

  const all = data?.data ?? [];
  const effectiveSearch = (search.trim() || globalSearch.trim()).toLowerCase();
  const rows = effectiveSearch
    ? all.filter(a =>
      (a.name || '').toLowerCase().includes(effectiveSearch) ||
      (a.email || '').toLowerCase().includes(effectiveSearch) ||
      (a.course || '').toLowerCase().includes(effectiveSearch)
    )
    : all;

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="bg-white rounded-xl overflow-hidden"
      style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}
    >
      {/* Header */}
      <div className="section-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUserGraduate style={{ color: '#7c3aed' }} /> Admissions
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            {all.length} total records
          </p>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, course…"
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
              {['Date', "Parent's name", "Child's name", 'Email', 'Phone', 'Course', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No records found.</td></tr>
            ) : rows.map((adm) => (
              <tr key={adm._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {new Date(adm.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1e293b' }}>{adm.name}</td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                  {adm.details?.split('\n').find(line => line.includes('Child Name:'))?.replace('Child Name: ', '').trim() || '-'}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                  <a href={`mailto:${adm.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{adm.email}</a>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{adm.phone}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {adm.course}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <select
                    value={adm.status || 'Pending'}
                    onChange={(e) => statusMutation.mutate({ id: adm._id, status: e.target.value })}
                    disabled={statusMutation.isPending}
                    style={{
                      background: (STATUS_COLORS[adm.status || 'Pending'] || STATUS_COLORS.Pending).bg,
                      color: (STATUS_COLORS[adm.status || 'Pending'] || STATUS_COLORS.Pending).text,
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
                    onClick={() => window.confirm('Delete this admission record?') && delMutation.mutate(adm._id)}
                    disabled={delMutation.isPending}
                    title="Delete"
                    style={{ background: '#fef2f2', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#dc2626', cursor: 'pointer', transition: 'background .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
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
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No records found.</div>
        ) : rows.map((adm) => {
          const childName = adm.details?.split('\n').find(line => line.includes('Child Name:'))?.replace('Child Name: ', '').trim() || '-';
          return (
            <div key={adm._id} className="mobile-card">
              <div className="mobile-card-header">
                <div className="mobile-card-title">{adm.name}</div>
                <div className="mobile-card-date">{new Date(adm.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <div className="mobile-card-body">
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Child</span>
                  <span className="mobile-card-value">{childName}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Email</span>
                  <span className="mobile-card-value">{adm.email}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Phone</span>
                  <span className="mobile-card-value">{adm.phone}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Course</span>
                  <span className="mobile-card-value">
                    <span style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>{adm.course}</span>
                  </span>
                </div>
              </div>
              <div className="mobile-card-footer">
                <select
                  value={adm.status || 'Pending'}
                  onChange={(e) => statusMutation.mutate({ id: adm._id, status: e.target.value })}
                  disabled={statusMutation.isPending}
                  style={{
                    background: (STATUS_COLORS[adm.status || 'Pending'] || STATUS_COLORS.Pending).bg,
                    color: (STATUS_COLORS[adm.status || 'Pending'] || STATUS_COLORS.Pending).text,
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
                  onClick={() => window.confirm('Delete this admission record?') && delMutation.mutate(adm._id)}
                  disabled={delMutation.isPending}
                  className="mobile-card-btn delete"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdmissionsView;

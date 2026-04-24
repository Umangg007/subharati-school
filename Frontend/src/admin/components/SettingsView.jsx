import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaLock, FaUserShield, FaSchool, FaGlobe, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { changePassword } from '../api';

const SettingsView = ({ pageVariants }) => {
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handlePassChange = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    
    if (passForm.newPassword !== passForm.confirmPassword) {
      return setStatus({ type: 'error', msg: 'New passwords do not match' });
    }

    setLoading(true);
    try {
      await changePassword(passForm.currentPassword, passForm.newPassword);
      setStatus({ type: 'success', msg: 'Password updated successfully!' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>System Settings</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage your account and school preferences</p>
      </div>

      {/* Security Section */}
      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaLock style={{ color: '#ef4444' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Security & Password</h3>
        </div>
        
        <form onSubmit={handlePassChange} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {status.msg && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              fontSize: '0.875rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              {status.msg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Current Password</label>
              <input 
                type="password" 
                required
                value={passForm.currentPassword}
                onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>New Password</label>
              <input 
                type="password" 
                required
                value={passForm.newPassword}
                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Confirm New Password</label>
              <input 
                type="password" 
                required
                value={passForm.confirmPassword}
                onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: '#7c3aed', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.5rem', 
                padding: '0.6rem 1.5rem', 
                fontWeight: 600, 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all .2s'
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* School Info Section (Read Only for now) */}
      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaSchool style={{ color: '#3b82f6' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>School Identity</h3>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>School Name</span>
              <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>Subharati Pre-Primary School</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Admin Email</span>
              <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>admin@subharati.edu.in</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Website URL</span>
              <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 500 }}>https://subharati.edu.in</span>
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
            <FaGlobe style={{ marginRight: '0.4rem' }} /> School identity settings are currently managed by the system administrator.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;

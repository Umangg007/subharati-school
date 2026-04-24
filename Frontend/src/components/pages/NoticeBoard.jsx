import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBullhorn, FaSearch, FaChevronRight, FaCalendarAlt, FaUserGraduate, FaBell, FaSpinner, FaTimes } from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import { apiRequest } from '../../utils/api';
import './NoticeBoard.css';

const categories = ['All', 'General', 'Academic', 'Holiday', 'Exam'];

const NoticeBoard = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await apiRequest('/api/notices');
        setNotices(response.data || []);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = activeCategory === 'All' || notice.tag === activeCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="notice-page-wrapper">
      <PageHeader 
        title="Notice"
        highlightWord="Board"
        subtitle="Stay updated with the latest news, schedules, and important alerts from Subharati School. Managed by the Admin Desk for timely communication."
        icon={<><FaBell /> OFFICIAL ANNOUNCEMENTS</>}
        stats={[
          { value: notices.length.toString().padStart(2, '0'), label: "ACTIVE NOTICES" },
          { value: "24h", label: "UPDATE CYCLE" }
        ]}
      />

      <div className="notice-main-content">
        {/* Controls Section */}
        <div className="notice-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Timeline / Grid */}
        <div className="notices-grid">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', width: '100%', gridColumn: '1 / -1', color: 'var(--brand-primary)' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FaSpinner size={32} />
              </motion.div>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading notices...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <motion.div
                    key={notice._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="notice-premium-card"
                  >
                    <div className="card-left-accent" data-tag={notice.tag}></div>

                    <div className="notice-card-header">
                      <span className="notice-date">
                        <FaCalendarAlt /> {new Date(notice.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <div className="notice-tags">
                        <span className={`tag-badge tag-${notice.tag.toLowerCase()}`}>{notice.tag}</span>
                        {notice.isNew && <span className="tag-new pulse">Latest</span>}
                      </div>
                    </div>

                    <h3 className="notice-card-title">{notice.title}</h3>
                    <p className="notice-card-desc">{notice.description}</p>

                    <div className="notice-card-footer">
                      <button className="read-more-btn" onClick={() => setSelectedNotice(notice)}>
                        Read Details <FaChevronRight className="arrow-icon" />
                      </button>
                      <div className="author-info">
                        <FaUserGraduate className="author-icon" />
                        <span>{notice.publishedBy || 'Admin Desk'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="no-results"
                >
                  <FaBullhorn className="no-result-icon" />
                  <h3>No notices found</h3>
                  <p>We couldn't find any announcements matching your search or filter criteria.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedNotice && (
          <div className="modal-overlay" onClick={() => setSelectedNotice(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            >
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`tag-badge tag-${selectedNotice.tag.toLowerCase()}`}>{selectedNotice.tag}</span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FaCalendarAlt /> {new Date(selectedNotice.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{selectedNotice.title}</h2>
                </div>
                <button onClick={() => setSelectedNotice(null)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <FaTimes />
                </button>
              </div>
              <div style={{ padding: '2rem' }}>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1.05rem', whiteSpace: 'pre-wrap', margin: 0 }}>{selectedNotice.description}</p>
              </div>
              <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                <FaUserGraduate /> Published by <strong style={{ color: '#1e293b' }}>{selectedNotice.publishedBy || 'Admin Desk'}</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeBoard;

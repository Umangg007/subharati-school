import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaGraduationCap, FaEnvelopeOpenText,
  FaCalendarAlt, FaImages, FaNewspaper, FaVideo,
  FaSearch, FaBars, FaTimes, FaSignOutAlt, FaCog
} from 'react-icons/fa';
import DashboardView from './components/DashboardView';
import AdmissionsView from './components/AdmissionsView';
import EnquiriesView from './components/EnquiriesView';
import EventsView from './components/EventsView';
import NoticesView from './components/NoticesView';
import GalleryView from './components/GalleryView';
import VideosView from './components/VideosView';
import SettingsView from './components/SettingsView';
import './AdminDashboard.css';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { id: 'admissions', label: 'Admissions', icon: FaGraduationCap },
  { id: 'enquiries', label: 'Enquiries', icon: FaEnvelopeOpenText },
  { id: 'events', label: 'Events', icon: FaCalendarAlt },
  { id: 'gallery', label: 'Gallery', icon: FaImages },
  { id: 'videos', label: 'Videos', icon: FaVideo },
  { id: 'notices', label: 'Notices', icon: FaNewspaper },
  { id: 'settings', label: 'Settings', icon: FaCog },
];

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -16 },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  const renderSection = () => {
    const sharedProps = { pageVariants, globalSearch: searchQuery };
    switch (activeSection) {
      case 'dashboard': return <DashboardView {...sharedProps} />;
      case 'admissions': return <AdmissionsView {...sharedProps} />;
      case 'enquiries': return <EnquiriesView {...sharedProps} />;
      case 'events': return <EventsView {...sharedProps} />;
      case 'gallery': return <GalleryView {...sharedProps} />;
      case 'videos': return <VideosView {...sharedProps} />;
      case 'notices': return <NoticesView {...sharedProps} />;
      case 'settings': return <SettingsView pageVariants={pageVariants} />;
      default: return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}

      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.jpeg" alt="Subharati Logo" className="logo-img" />
            {sidebarOpen && <span>Subharati</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              className={`nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => setActiveSection(id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="nav-icon" />
              {sidebarOpen && <span>{label}</span>}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <motion.button className="logout-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            {sidebarOpen && <span>Log Out</span>}
          </motion.button>
        </div>
      </motion.aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><FaBars /></button>
            <div>
              <h1 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{activeSection}</h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b' }}>Subharati Pre-Primary School — Admin Portal</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </header>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;

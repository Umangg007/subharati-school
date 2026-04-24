import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaImages, FaFilter } from 'react-icons/fa';
import { MdGridView, MdViewQuilt } from 'react-icons/md';
import useApi from '../../utils/useApi';
import { resolveMediaUrl } from '../../utils/api';
import './Gallery.css';

const CATEGORIES = ['All', 'Festival', 'Sports', 'Annual Function', 'Campus', 'Happy faces'];

const CATEGORY_COLORS = {
  'Festival':        { bg: '#FFF3E0', text: '#E65100', dot: '#FF6F00' },
  'Sports':          { bg: '#E8F5E9', text: '#1B5E20', dot: '#43A047' },
  'Annual Function': { bg: '#E3F2FD', text: '#0D47A1', dot: '#1976D2' },
  'Campus':          { bg: '#F3E5F5', text: '#4A148C', dot: '#8E24AA' },
  'Happy faces':     { bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300' },
};

// ─── Lightbox (Portal-based, covers everything) ─────────────────────────────
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const current = images[currentIndex];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  if (!current) return null;

  const catStyle = CATEGORY_COLORS[current.category] || CATEGORY_COLORS['Uncategorized'];

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0,
        zIndex: 2147483647,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Counter */}
      <div style={{ position: 'absolute', top: 24, left: 28, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', userSelect: 'none', pointerEvents: 'none' }}>
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: 20, right: 24, zIndex: 10,
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        aria-label="Close"
      >
        <FaTimes />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        style={{
          position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        aria-label="Previous"
      >
        <FaChevronLeft />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id || currentIndex}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '90vw', maxHeight: '90vh' }}
        >
          <img
            src={current.imageUrl || ''}
            alt={current.title || 'Gallery Image'}
            style={{
              maxWidth: '88vw', maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              display: 'block',
            }}
          />
          {/* Caption */}
          <div style={{
            marginTop: 20, padding: '14px 28px', borderRadius: 16,
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center', maxWidth: 500,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: catStyle.bg, color: catStyle.text,
              padding: '4px 12px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: catStyle.dot, display: 'inline-block' }} />
              {current.category || 'Uncategorized'}
            </span>
            <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: '4px 0 0', fontFamily: 'Outfit, sans-serif' }}>
              {current.title || 'Gallery Image'}
            </h2>
            {current.description && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 }}>{current.description}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        style={{
          position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        aria-label="Next"
      >
        <FaChevronRight />
      </button>
    </div>,
    document.body
  );
};

// ─── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard = ({ item, index, onOpen, layout }) => {
  const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Uncategorized'];
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className={`gallery-card ${layout === 'masonry' ? 'masonry-card' : ''}`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onClick={() => onOpen(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(index)}
      aria-label={`View ${item.title}`}
    >
      <div className="gallery-card-img-wrap">
        {!loaded && <div className="img-skeleton" />}
        <img
          src={item.imageUrl || ''}
          alt={item.title || 'Gallery Image'}
          className={`gallery-card-img ${loaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="gallery-card-overlay">
          <div className="overlay-content">
            <span className="expand-icon"><FaExpand /></span>
            <h3 className="overlay-title">{item.title}</h3>
            <span
              className="overlay-badge"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              {item.category || 'Uncategorized'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Gallery Page ─────────────────────────────────────────────────────────
const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection]   = useState('Primary');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [layout, setLayout] = useState('grid');
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const apiPath = `/api/gallery?limit=100&section=${encodeURIComponent(activeSection)}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
  const { data: apiItems, loading, error } = useApi(apiPath);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const clearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    searchRef.current?.focus();
  };

  const galleryItems = (apiItems || []).map(item => ({
    ...item,
    imageUrl: resolveMediaUrl(item.imageUrl || item.resolvedImageUrl || item.url || ''),
    title: item.title || item.resolvedTitle || item.caption || 'Gallery Image',
    category: item.category || 'Uncategorized',
    description: item.description || item.caption || ''
  }));

  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const visibleItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !normalizedSearch || [item.title, item.description, item.category]
      .some(field => field?.toLowerCase().includes(normalizedSearch));
    return matchesCategory && matchesSearch;
  });

  const openLightbox  = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => (i - 1 + visibleItems.length) % visibleItems.length), [visibleItems.length]);
  const nextImage = useCallback(() => setLightboxIndex(i => (i + 1) % visibleItems.length), [visibleItems.length]);

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    if (cat === 'All') { acc[cat] = galleryItems.length; return acc; }
    acc[cat] = galleryItems.filter(i => i.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="gallery-page">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="gallery-hero">
        <div className="gallery-hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-overlay" />
        </div>
        <div className="section-container gallery-hero-inner">
          <motion.div className="gallery-hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.span className="gallery-hero-eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <FaImages /> School Life
            </motion.span>
            <motion.h1 className="gallery-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Moments That <span className="gallery-hero-gradient">Matter</span>
            </motion.h1>
            <motion.p className="gallery-hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              A visual journey through the vibrant life, celebrations, and milestones of Subharati School.
            </motion.p>
            <motion.div className="gallery-hero-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
              {[
                { label: 'Total Photos', value: galleryItems.length + '+' },
                { label: 'Categories', value: CATEGORIES.length - 1 },
                { label: 'Years of Memories', value: '10+' },
              ].map(stat => (
                <div className="hero-stat" key={stat.label}>
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <div className="gallery-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── Controls ──────────────────────────────────────────────────────────── */}
      <section className="gallery-controls-section">
        <div className="section-container">

          {/* Section Tabs */}
          <div className="gallery-section-tabs">
            {['Pre-Primary', 'Primary'].map(sec => (
              <button
                key={sec}
                className={`gallery-section-tab ${activeSection === sec ? 'active' : ''}`}
                onClick={() => { setActiveSection(sec); setActiveCategory('All'); setSearch(''); setDebouncedSearch(''); }}
              >
                {sec}
              </button>
            ))}
          </div>

          <motion.div className="gallery-controls" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {/* Search */}
            <div className="gallery-search-wrap">
              <FaSearch className="search-icon" />
              <input
                id="gallery-search-input"
                ref={searchRef}
                type="text"
                className="gallery-search"
                placeholder="Search photos..."
                value={search}
                onChange={handleSearchChange}
                aria-label="Search gallery photos"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    className="search-clear"
                    onClick={clearSearch}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Layout toggle */}
            <div className="layout-toggle" role="group" aria-label="Grid layout">
              <button id="gallery-layout-grid" className={`layout-btn ${layout === 'grid' ? 'active' : ''}`} onClick={() => setLayout('grid')} title="Grid view">
                <MdGridView />
              </button>
              <button id="gallery-layout-masonry" className={`layout-btn ${layout === 'masonry' ? 'active' : ''}`} onClick={() => setLayout('masonry')} title="Masonry view">
                <MdViewQuilt />
              </button>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div className="gallery-filters" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategory === cat;
              const catStyle = cat !== 'All' ? CATEGORY_COLORS[cat] : null;
              return (
                <motion.button
                  key={cat}
                  id={`gallery-filter-${cat.replace(/\s/g, '-').toLowerCase()}`}
                  className={`gallery-filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={isActive && catStyle ? { background: catStyle.bg, color: catStyle.text, borderColor: catStyle.dot } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {cat !== 'All' && isActive && <span className="filter-dot" style={{ background: catStyle?.dot }} />}
                  {cat}
                  <span className={`filter-count ${isActive ? 'active-count' : ''}`}>{categoryCounts[cat] || 0}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Grid ─────────────────────────────────────────────────────── */}
      <section className="gallery-grid-section">
        <div className="section-container">

          {/* Loading */}
          {loading && (
            <div className={layout === 'masonry' ? 'gallery-masonry skeleton-grid' : 'gallery-grid skeleton-grid'}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="gallery-card skeleton-card">
                  <div className="gallery-card-img-wrap">
                    <div className="img-skeleton" style={{ height: layout === 'masonry' ? `${180 + (i % 3) * 60}px` : '260px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && galleryItems.length === 0 && (
            <motion.div className="gallery-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="empty-icon">📷</div>
              <h3>Unable to load gallery</h3>
              <p>Please check your connection.</p>
            </motion.div>
          )}

          {/* Empty */}
          {!loading && visibleItems.length === 0 && !error && (
            <motion.div className="gallery-empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="empty-icon">🔍</div>
              <h3>No photos found</h3>
              <p>Try adjusting your search or filter, or upload photos via the admin panel.</p>
              <button className="gallery-reset-btn" onClick={() => { setActiveCategory('All'); clearSearch(); }}>
                Reset Filters
              </button>
            </motion.div>
          )}

          {/* Grid */}
          {!loading && visibleItems.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activeCategory}-${debouncedSearch}-${layout}`}
                className={layout === 'masonry' ? 'gallery-masonry' : 'gallery-grid'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {visibleItems.map((item, index) => (
                  <GalleryCard key={item._id} item={item} index={index} onOpen={openLightbox} layout={layout} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Results info */}
          {!loading && visibleItems.length > 0 && (
            <motion.p className="gallery-results-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <FaFilter />
              Showing <strong>{visibleItems.length}</strong> photo{visibleItems.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {debouncedSearch ? ` matching "${debouncedSearch}"` : ''}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={visibleItems}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

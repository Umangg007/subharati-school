import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import './GalleryPreview.css';
import useApi from '../../utils/useApi';
import { resolveMediaUrl } from '../../utils/api';

const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  const current = images[index];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!current) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100000] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute top-6 left-8 text-slate-500 font-bold text-sm tracking-widest uppercase">
        {index + 1} / {images.length}
      </div>

      <button
        onClick={onClose}
        className="absolute top-6 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:rotate-90 z-10"
      >
        <FaTimes size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:-translate-x-2 z-10"
      >
        <FaChevronLeft size={24} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          className="relative w-full h-full flex flex-col items-center justify-center p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={current.imageUrl}
            alt={current.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl min-w-[320px] text-center">
            <h2 className="text-white font-bold text-xl mb-1">{current.title}</h2>
            <p className="text-slate-400 text-sm max-w-md">{current.category}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:translate-x-2 z-10"
      >
        <FaChevronRight size={24} />
      </button>
    </motion.div>
  );
};

const STATIC_PREVIEWS = [
  { _id: 'sp1', imageUrl: '/images/custom_playgroup.jpg', title: 'Joyful Learning', category: 'Early Years' },
  { _id: 'sp2', imageUrl: '/images/custom_std_2.jpg', title: 'Artistic Expression', category: 'Primary' },
  { _id: 'sp3', imageUrl: '/images/custom_std_7.jpg', title: 'Science Exploration', category: 'Middle School' },
  { _id: 'sp4', imageUrl: '/images/custom_std_higher_new.jpg', title: 'Practical Skills', category: 'Higher Secondary' },
  { _id: 'sp5', imageUrl: '/images/custom_std_5.jpg', title: 'Creative Activities', category: 'Campus Life' },
  { _id: 'sp6', imageUrl: '/images/custom_std_2.jpg', title: 'Happy Learning', category: 'Primary' }
];

const PREVIEW_COUNT = 6;
const DB_FETCH_LIMIT = 12;

const GalleryPreview = () => {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const { data: apiItems } = useApi(`/api/gallery?limit=${DB_FETCH_LIMIT}`, {}, []);

  const dbImages = (apiItems || []).map((item) => ({
    _id: item._id,
    imageUrl: resolveMediaUrl(item.resolvedImageUrl || item.imageUrl || item.url || ''),
    title: item.resolvedTitle || item.title || item.caption || 'Gallery Image',
    category: item.category || 'Gallery'
  })).filter((item) => Boolean(item.imageUrl));

  const previewImages = dbImages.length >= PREVIEW_COUNT
    ? dbImages.slice(0, PREVIEW_COUNT)
    : [...dbImages, ...STATIC_PREVIEWS].slice(0, PREVIEW_COUNT);

  return (
    <section className="gallery-preview">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
        >
          <span className="subtitle">Moments at Subharati</span>
          <h2 className="title">Glimpses of Joyful Learning</h2>
          <p className="description">
            Experience the vibrant life at our campus through these captured moments of exploration, creativity, and growth.
          </p>
        </motion.div>

        <div className="preview-grid">
          <motion.div
            className="discover-btn-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/gallery" className="discover-arrow-wrapper">
              <div className="discover-arrow-btn">
                <FaArrowRight />
              </div>
              <span className="discover-text">View More Photos</span>
            </Link>
          </motion.div>

          {previewImages.map((image, index) => (
            <motion.div
              key={image._id}
              className={`preview-card card-${index + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="image-wrapper" onClick={() => setLightboxIdx(index)}>
                <img src={image.imageUrl} alt={image.title} className="preview-img" />
                <div className="overlay">
                  <span className="image-category">{image.category}</span>
                  <h3 className="image-title">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && createPortal(
          <Lightbox
            images={previewImages}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx(i => (i - 1 + previewImages.length) % previewImages.length)}
            onNext={() => setLightboxIdx(i => (i + 1) % previewImages.length)}
          />,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreview;

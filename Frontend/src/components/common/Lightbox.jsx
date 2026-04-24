import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import './Lightbox.css';

const Lightbox = ({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onPrev, 
  onNext,
  showThumbnails = false,
  showInfo = true 
}) => {
  const current = images[currentIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKey);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !current) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="lightbox-container">
          {/* Header */}
          <div className="lightbox-header">
            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="lightbox-controls">
              {showInfo && current.title && (
                <div className="lightbox-title">{current.title}</div>
              )}
              <button
                className="lightbox-btn lightbox-close"
                onClick={onClose}
                aria-label="Close lightbox"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <motion.img
              src={current.src || current.imageUrl}
              alt={current.alt || current.title || 'Image'}
              className="lightbox-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  disabled={currentIndex === 0}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  disabled={currentIndex === images.length - 1}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="lightbox-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`lightbox-thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); /* Navigate to thumbnail */ }}
                >
                  <img
                    src={image.src || image.imageUrl}
                    alt={image.alt || image.title || `Thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Lightbox;

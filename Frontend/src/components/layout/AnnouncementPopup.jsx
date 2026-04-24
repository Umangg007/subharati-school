import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import LightboxImage from '../common/LightboxImage';
import './AnnouncementPopup.css';
import announcementPoster from '../../assets/announcement.jpeg';

const AnnouncementPopup = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  // Announcement popup images for lightbox
  const announcementImages = [
    { 
      src: announcementPoster, 
      alt: "Admissions Open poster",
      title: "Admissions Open 2026-27"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="popup-overlay">
          <motion.div 
            className="popup-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="popup-close" onClick={handleClose}><FaTimes /></button>
            <div className="popup-body">
              <div className="popup-image">
                <LightboxImage 
                  src={announcementPoster} 
                  alt="Admissions Open poster"
                  images={announcementImages}
                  index={0}
                />
              </div>
              <span className="popup-badge">ADMISSIONS OPEN 2026-27</span>
              <h2>Enroll Now for Your Child's Best Nurturing</h2>
              <p>A warm, engaging, and value-based start for young learners.
                Secure a place in a school that families trust.</p>
              <a href="/admission" className="popup-cta" onClick={handleClose}>Apply Now</a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementPopup;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightboxImage from './LightboxImage';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Splash screen images for lightbox
  const splashImages = [
    { 
      src: "/Subharati/gallery/about.jpeg", 
      alt: "School Building",
      title: "Subharati Pre Primary School Campus"
    },
    { 
      src: "/Subharati/gallery/logo.jpeg", 
      alt: "School Logo",
      title: "Subharati Pre Primary School Logo"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 1000); // Allow time for the sliding animation
      }
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Top Half of the sliding door */}
          <motion.div 
            className="splash-door top"
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
          />
          
          {/* Bottom Half of the sliding door */}
          <motion.div 
            className="splash-door bottom"
            exit={{ y: "100%" }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
          />

          {/* Background School Photo */}
          <motion.div 
            className="splash-bg-image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <LightboxImage 
              src="/Subharati/gallery/about.jpeg" 
              alt="School Building"
              images={splashImages}
              index={0}
              showLightbox={false}
            />
          </motion.div>

          <div className="splash-content">
            <motion.div 
              className="vertical-line left"
              initial={{ height: 0 }}
              animate={{ height: "150px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="arrow down"></div>
            </motion.div>

            <motion.div 
              className="logo-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="splash-logo-circle">
                <LightboxImage 
                  src="/Subharati/gallery/logo.jpeg" 
                  alt="School Logo"
                  images={splashImages}
                  index={1}
                  showLightbox={false}
                />
              </div>
              <div className="splash-text">
                <motion.h1 
                  initial={{ letterSpacing: "10px", opacity: 0 }}
                  animate={{ letterSpacing: "4px", opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                >
                  SUBHARATI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  PRE PRIMARY SCHOOL
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="splash-management"
                >
                  (Managed by JL trust)
                </motion.div>
                <div className="splash-location">AHMEDABAD</div>
              </div>
            </motion.div>

            <motion.div 
              className="vertical-line right"
              initial={{ height: 0 }}
              animate={{ height: "150px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="arrow up"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

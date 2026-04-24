import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaChevronRight, FaChevronLeft, FaVolumeUp, FaVolumeMute, FaShieldAlt, FaGraduationCap, FaHandsHelping } from 'react-icons/fa';
import LightboxImage from '../common/LightboxImage';
import './Hero.css';

const slides = [
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dpxk81avt/video/upload/q_auto/f_auto/v1776926461/hreo_faoajd.mp4',
    title: 'Subharati Pre Primary',
    subtitle: 'Nurturing Young Minds with Love & Values',
    cta: 'Admissions Open 2026-27',
    link: '/admission'
  },
  
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  // Hero images for lightbox
  const heroImages = [
    { 
      src: "/Subharati/gallery/logo.jpeg", 
      alt: "Subharati Logo",
      title: "Subharati Pre Primary School Logo"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {slides[currentSlide].type === 'video' ? (
            <div className="hero-video-container">
              <video
                ref={videoRef}
                className="hero-bg-video"
                src={slides[currentSlide].src}
                autoPlay
                muted={true}
                loop
                playsInline
                preload="none"
                poster=""
                controlsList="nodownload"
                disablePictureInPicture
              />
            </div>
          ) : slides[currentSlide].type === 'image' ? (
            <div className="hero-video-container">
              <LightboxImage
                className="hero-bg-video"
                src={slides[currentSlide].src}
                alt="Slide Background"
                images={heroImages}
                index={0}
                showLightbox={false}
              />
            </div>
          ) : null}
          <div className="hero-overlay" />

          <div className="hero-content">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <LightboxImage 
                src="/Subharati/gallery/logo.jpeg" 
                alt="Subharati Logo" 
                className="hero-main-logo"
                images={heroImages}
                index={0}
                showLightbox={false}
              />
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              className="hero-trust-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Managed by J L Trust
            </motion.p>

            <motion.p
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={slides[currentSlide].link} className="cta-primary">
                {slides[currentSlide].cta} <FaChevronRight />
              </Link>
            </motion.div>

            <motion.div
              className="hero-trust-strip"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span><FaGraduationCap /> Stage-wise Learning</span>
              <span><FaShieldAlt /> Safe & Caring Campus</span>
              <span><FaHandsHelping /> Parent Partnership</span>
            </motion.div>
          </div>

          {slides[currentSlide].type === 'video' && (
            <motion.button
              className="music-toggle-btn"
              onClick={toggleMute}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              <span>{isMuted ? 'Experience Audio' : 'Mute Audio'}</span>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Hero;

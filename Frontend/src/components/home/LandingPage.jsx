import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LightboxImage from '../common/LightboxImage';
import './LandingPage.css';

const LandingPage = () => {
  // Landing page images for lightbox
  const landingImages = [
    { 
      src: "/Subharati/gallery/logo.jpeg", 
      alt: "Subharati Pre Primary School",
      title: "Subharati Pre Primary School Logo"
    }
  ];

  return (
    <section className="landing-page">
      <div className="landing-backdrop" />
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />

      <motion.div
        className="landing-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <LightboxImage
          src="/Subharati/gallery/logo.jpeg"
          alt="Subharati Pre Primary School"
          className="landing-logo"
          images={landingImages}
          index={0}
          showLightbox={false}
        />

        <p className="landing-kicker">Subharati Pre Primary School</p>
        <h1>Small Steps, Bright Futures</h1>
        <p className="landing-subtitle">
          A joyful and safe learning environment where curiosity grows into confidence.
        </p>

        <Link to="/home" className="visit-btn">
          Enter to the world of Excellence
        </Link>
      </motion.div>
    </section>
  );
};

export default LandingPage;

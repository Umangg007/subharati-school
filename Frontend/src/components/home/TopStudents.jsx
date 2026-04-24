import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import LightboxImage from '../common/LightboxImage';
import './TopStudents.css';

const wallOfFame = [
  {
    title: 'Scholastic Excellence',
    student: 'Young Achiever',
    standard: 'Pre-Primary',
    year: '2024-25',
    highlight: 'A proud recognition moment celebrating confidence, discipline, and joyful learning.',
    image: '/Subharati/gallery/WhatsApp Image 2026-03-09 at 7.13.19 PM.jpeg',
    tag: 'Achievement',
    tone: 'gold'
  },
  {
    title: 'Innovation Showcase',
    student: 'Creative Minds',
    standard: 'Pre-Primary',
    year: '2024-25',
    highlight: 'Hands-on classroom activities that encourage teamwork, expression, and early creativity.',
    image: '/images/WhatsApp Image 2026-03-18 at 11.11.02 AM.jpeg',
    tag: 'Learning',
    tone: 'sky'
  },
  {
    title: 'Sports Achievement',
    student: 'Festival Spirit',
    standard: 'School Event',
    year: '2024-25',
    highlight: 'Bright, energetic campus moments that reflect community participation and celebration.',
    image: '/Subharati/gallery/WhatsApp Image 2026-03-09 at 7.12.28 PM.jpeg',
    tag: 'Campus Life',
    tone: 'lavender'
  },
  {
    title: 'Creative Expression',
    student: 'Art & Culture',
    standard: 'School Event',
    year: '2024-25',
    highlight: 'Vibrant cultural participation that highlights tradition, confidence, and school pride.',
    image: '/Subharati/gallery/WhatsApp Image 2026-03-09 at 7.13.21 PM.jpeg',
    tag: 'Culture',
    tone: 'mint'
  },
  {
    title: 'Leadership & Confidence',
    student: 'Holi Celebration',
    standard: 'Junior Wing',
    year: '2024-25',
    highlight: 'Classroom celebration and color play that show joy, belonging, and active participation.',
    image: '/images/image.png',
    tag: 'Celebration',
    tone: 'peach'
  }
];

const achievements = [
  'Academic Stars',
  'Creative Showcase',
  'Sports Spirit',
  'Cultural Pride'
];

const TopStudents = () => {
  // Create wall of fame images array for lightbox
  const getWallOfFameImages = () => {
    return wallOfFame.map(achievement => ({
      src: achievement.image,
      alt: achievement.student,
      title: `${achievement.title} - ${achievement.student}`
    }));
  };

  return (
    <section className="top-students">
      <div className="section-container">
        <motion.div
          className="ts-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center' }}
        >
          <h2>Wall of Fame</h2>
          <p>Celebrating student excellence in academics, innovation, sports, leadership, and creativity.</p>
        </motion.div>

        <motion.div
          className="fame-featured"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="featured-content">
            <span className="featured-kicker">Featured Achiever</span>
            <h3>{wallOfFame[0].student}</h3>
            <p className="featured-meta">{wallOfFame[0].standard} • Session {wallOfFame[0].year}</p>
            <p className="featured-highlight">{wallOfFame[0].highlight}</p>
            <Link to="/gallery" className="featured-cta">
              View All Achievements <FaArrowRight />
            </Link>
          </div>
          <LightboxImage 
            src={wallOfFame[0].image} 
            alt={wallOfFame[0].student}
            images={getWallOfFameImages()}
            index={0}
            className="featured-image"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default TopStudents;
import { useState, useEffect } from 'react';
import { FaSchool, FaChalkboardTeacher, FaChild, FaTree, FaPlay, FaVideo, FaClock, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../common/PageHeader';
import LightboxImage from '../common/LightboxImage';
import useApi from '../../utils/useApi';
import './Infrastructure.css';

const facilities = [
  {
    icon: <FaSchool />,
    title: 'Smart Classrooms',
    description: 'Bright, age-appropriate classrooms with digital support tools to make foundational learning engaging.'
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Activity Zones',
    description: 'Dedicated corners for storytelling, role play, drawing, and hands-on activities that build confidence.'
  },
  {
    icon: <FaChild />,
    title: 'Safe Play Area',
    description: 'Child-safe indoor and outdoor play spaces designed for motor-skill development and joyful exploration.'
  },
  {
    icon: <FaTree />,
    title: 'Nurturing Campus',
    description: 'A clean, secure, and welcoming environment where children feel comfortable, curious, and cared for.'
  }
];

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Infrastructure = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const { data: videos, loading, error } = useApi('/api/videos?category=Infrastructure', {}, []);

  // Create video thumbnail images array for lightbox
  const getVideoImages = () => {
    return videos.map(video => ({
      src: video.thumbnailUrl || video.url.replace(/\.[^/.]+$/, '.jpg'),
      alt: video.title,
      title: video.title
    }));
  };

  // Featured video categories
  const featuredVideos = [
    { title: 'School Full View', category: 'Campus Tour' },
    { title: 'Art Room', category: 'Facilities' },
    { title: 'Computer Lab', category: 'Labs' },
    { title: 'Science Lab', category: 'Labs' },
    { title: 'Play Group', category: 'Play Area' }
  ];

  // Group videos by category for display
  const groupedVideos = videos.reduce((acc, video) => {
    const cat = video.category || 'Infrastructure';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(video);
    return acc;
  }, {});

  return (
    <section className="infrastructure-page">
      <PageHeader
        title="Our"
        highlightWord="Infrastructure"
        subtitle="Purpose-built spaces that help children learn, play, and grow with confidence every day."
        icon={<>CAMPUS FACILITIES</>}
        stats={[
          { value: 'Safe', label: 'ENVIRONMENT' },
          { value: 'Modern', label: 'CLASSROOMS' },
          { value: 'Creative', label: 'ACTIVITY ZONES' },
          { value: 'Child-First', label: 'DESIGN' }
        ]}
      />

      {/* Video Gallery Section */}
      <div className="infrastructure-videos-section">
        <div className="section-container">
          <motion.div 
            className="videos-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="videos-eyebrow"><FaVideo /> Virtual Tour</span>
            <h2 className="videos-title">Explore Our <span className="gradient-text">Campus</span></h2>
            <p className="videos-subtitle">Take a virtual walk through our world-class facilities designed for young learners</p>
          </motion.div>

          {loading && (
            <div className="videos-loading">
              <div className="video-skeleton-grid">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="video-skeleton-card">
                    <div className="skeleton-thumbnail" />
                    <div className="skeleton-text" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="videos-error">
              <p>Unable to load videos. Please try again later.</p>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="videos-empty">
              <FaVideo className="empty-icon" />
              <p>Videos coming soon! Check back later for virtual campus tours.</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="videos-grid">
              {videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  className="video-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => setPlayingVideo(video)}
                >
                  <div className="video-thumbnail">
                    <LightboxImage 
                      src={video.thumbnailUrl || video.url.replace(/\.[^/.]+$/, '.jpg')} 
                      alt={video.title}
                      images={getVideoImages()}
                      index={videos.indexOf(video)}
                      loading="lazy"
                      onError={(e) => { e.target.src = '/images/video-placeholder.jpg'; }}
                    />
                    <div className="video-overlay">
                      <div className="play-button">
                        <FaPlay />
                      </div>
                    </div>
                    {video.duration > 0 && (
                      <span className="video-duration">
                        <FaClock /> {formatDuration(video.duration)}
                      </span>
                    )}
                    <div className="video-category-badge">{video.category}</div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-description">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Facilities Cards Section */}
      <div className="infrastructure-grid-wrap">
        <motion.div 
          className="infrastructure-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {facilities.map((facility, index) => (
            <motion.article 
              key={facility.title} 
              className="infrastructure-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 26, 54, 0.12)' }}
            >
              <div className="infrastructure-icon">{facility.icon}</div>
              <h3>{facility.title}</h3>
              <p>{facility.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div 
            className="video-player-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div 
              className="video-player-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-player" onClick={() => setPlayingVideo(null)}>
                <FaExpand style={{ transform: 'rotate(45deg)' }} />
              </button>
              <div className="video-wrapper">
                <video 
                  src={playingVideo.url} 
                  controls 
                  autoPlay
                  muted
                  poster={playingVideo.thumbnailUrl}
                  playsInline
                />
              </div>
              <div className="video-player-info">
                <h3>{playingVideo.title}</h3>
                <p>{playingVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Infrastructure;

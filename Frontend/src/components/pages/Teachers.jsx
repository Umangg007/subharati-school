import { useState } from 'react';
import { FaUserGraduate, FaHeart, FaLightbulb, FaHandsHelping, FaPlay, FaVideo, FaClock, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../common/PageHeader';
import LightboxImage from '../common/LightboxImage';
import useApi from '../../utils/useApi';
import './Teachers.css';

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const teacherValues = [
  {
    icon: <FaUserGraduate />,
    title: 'Qualified Mentors',
    description: 'Experienced educators trained in early-childhood pedagogy and classroom care.'
  },
  {
    icon: <FaHeart />,
    title: 'Compassionate Guidance',
    description: 'Teachers build trust with every child through warmth, patience, and encouragement.'
  },
  {
    icon: <FaLightbulb />,
    title: 'Creative Methods',
    description: 'Play-based activities, storytelling, and interactive learning make each day meaningful.'
  },
  {
    icon: <FaHandsHelping />,
    title: 'Parent Partnership',
    description: 'Regular communication keeps families connected to progress and classroom growth.'
  }
];

const Teachers = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const { data: videos, loading, error } = useApi('/api/videos?category=Teachers', {}, []);

  const getVideoImages = () => {
    return videos.map(video => ({
      src: video.thumbnailUrl || video.url.replace(/\.[^/.]+$/, '.jpg'),
      alt: video.title,
      title: video.title
    }));
  };

  return (
    <section className="teachers-page">
      <PageHeader
        title="Our"
        highlightWord="Teachers"
        subtitle="A caring team that inspires curiosity, confidence, and strong early learning habits."
        icon={<>TEACHING EXCELLENCE</>}
        stats={[
          { value: 'Experienced', label: 'EDUCATORS' },
          { value: 'Child-Centric', label: 'APPROACH' },
          { value: 'Interactive', label: 'LESSONS' },
          { value: 'Supportive', label: 'MENTORSHIP' }
        ]}
      />

      {/* Video Gallery Section */}
      <div className="teachers-videos-section">
        <div className="section-container">
          <motion.div 
            className="videos-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="videos-eyebrow"><FaVideo /> Meet Our Teachers</span>
            <h2 className="videos-title">Hear From Our <span className="gradient-text">Educators</span></h2>
            <p className="videos-subtitle">Watch introduction videos from our passionate teaching staff</p>
          </motion.div>

          {loading && (
            <div className="videos-loading">
              <div className="video-skeleton-grid">
                {[1, 2, 3].map(i => (
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
              <p>Teacher videos coming soon!</p>
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

    {/* Team Photos Section */}
    <div className="team-photos-section">
      <div className="team-photos-wrap">
        <div className="team-photo-card">
          <img 
            src="https://res.cloudinary.com/dpxk81avt/image/upload/q_auto/f_auto/v1776935217/Annual_function_16_paxc7y.jpg" 
            alt="Primary Section Teachers"
            className="team-photo-img"
          />
          <div className="team-photo-label">
            <h3>Primary Section</h3>
            <p>Our dedicated primary educators</p>
          </div>
        </div>
  
        <div className="team-photo-card">
          <img 
            src="https://res.cloudinary.com/dpxk81avt/image/upload/q_auto/f_auto/v1776935166/Annual_function_14_uka407.jpg" 
            alt="Pre-Primary Section Teachers"
            className="team-photo-img"
          />
          <div className="team-photo-label">
            <h3>Pre-Primary Section</h3>
            <p>Our caring pre-primary teachers</p>
          </div>
        </div>
      </div>
    </div>

      <div className="teachers-grid-wrap">
        <div className="teachers-grid">
          {teacherValues.map((value) => (
            <article key={value.title} className="teachers-card">
              <div className="teachers-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
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

export default Teachers;

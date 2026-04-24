import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight, FaFilter, FaStar, FaSpinner, FaTimes } from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import { apiRequest } from '../../utils/api';
import './Events.css';

const eventCategories = ['All Events', 'General', 'Academic', 'Sports', 'Cultural'];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiRequest('/api/events');
        setEvents(response.data || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    return activeCategory === 'All Events' || event.category === activeCategory;
  });

  return (
    <div className="events-page-wrapper">
      <PageHeader 
        title="School"
        highlightWord="Events"
        subtitle="Join us in celebrating the talent, energy, and milestones of our students. Explore our upcoming cultural, academic, and sporting events."
        icon={<><FaStar /> UPCOMING VIBRANCY</>}
        stats={[
          { value: `${events.length}+`, label: "UPCOMING EVENTS" },
          { value: "4", label: "CATEGORIES" },
          { value: "500+", label: "ATTENDEES" }
        ]}
      />

      <div className="events-main-content">
        {/* Filtering */}
        <div className="events-filter-bar">
          <FaFilter className="filter-icon-main" />
          <div className="events-categories">
            {eventCategories.map(cat => (
              <button
                key={cat}
                className={`event-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', width: '100%', gridColumn: '1 / -1', color: 'var(--brand-primary)' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FaSpinner size={32} />
              </motion.div>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading events...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="event-premium-card"
                  >
                    <div className="event-image-container">
                      <img src={event.imageUrl || "/images/std_4.png"} alt={event.title} className="event-image" />
                      <div className="event-date-badge">
                        <span className="ev-day">{new Date(event.date).getDate()}</span>
                        <span className="ev-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="event-category-pill">{event.category}</div>
                    </div>

                    <div className="event-card-body">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-desc">{event.description}</p>

                      <div className="event-info-grid">
                        <div className="event-info-item">
                          <FaCalendarAlt className="e-icon" />
                          <span>{event.time}</span>
                        </div>
                        <div className="event-info-item">
                          <FaMapMarkerAlt className="e-icon" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="event-info-item">
                          <FaUsers className="e-icon" />
                          <span>Open to all</span>
                        </div>
                      </div>

                      <button className="book-ticket-btn" onClick={() => setSelectedEvent(event)}>
                        View Details <FaArrowRight />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}
                >
                  <p>No events found for this category.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}
            >
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={selectedEvent.imageUrl || "/images/std_4.png"} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <FaTimes color="#333" />
                </button>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--brand-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600 }}>
                  {selectedEvent.category}
                </div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>{selectedEvent.title}</h2>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>{selectedEvent.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <FaCalendarAlt color="var(--brand-primary)" size={20} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Date & Time</div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{new Date(selectedEvent.date).toLocaleDateString('en-IN')} • {selectedEvent.time}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <FaMapMarkerAlt color="var(--brand-primary)" size={20} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Venue</div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{selectedEvent.venue}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;

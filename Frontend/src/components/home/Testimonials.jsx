import React from 'react';
// Removed motion import
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import './Testimonials.css';

const testimonials = [
  {
    name: "Mrs. Sneha Gupta",
    role: "Primary Parent",
    text: "Subharati has been a second home for my daughter. The transition from playgroup to primary was so smooth thanks to the dedicated staff.",
    rating: 5
  },
  {
    name: "Mr. Rajesh Patel",
    role: "Secondary Parent",
    text: "I am amazed by the academic rigor combined with personal attention. The new higher secondary section is a great addition.",
    rating: 5
  },
  {
    name: "Mrs. Anjali Shah",
    role: "Pre-Primary Parent",
    text: "The best school for early childhood education. Their focus on values and cultural celebrations is truly commendable.",
    rating: 5
  },
  {
    name: "Mr. Vikram Mehta",
    role: "Parent of Alumnus",
    text: "My son started here in Nursery and just completed 10th. The foundation laid here has made him a confident young man.",
    rating: 5
  },
  {
    name: "Mrs. Priya Desai",
    role: "Primary Parent",
    text: "The school really lives up to its name. The environment is supportive, and the teachers truly 'nurture' the students.",
    rating: 5
  },
  {
    name: "Mr. Amit Trivedi",
    role: "Secondary Parent",
    text: "Impressive infrastructure and modern teaching methods. It's rare to find such a balanced approach to education.",
    rating: 5
  }
];

const loopTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="section-container">
        <div
          className="section-header"
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--brand-primary)', marginBottom: '20px' }}>Voices of Our Community</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-soft)', maxWidth: '700px', margin: '0 auto' }}>
            Hear from the parents who have entrusted us with their children's future.
          </p>
        </div>

        <div className="testimonials-marquee">
          <div className="testimonials-track">
            {loopTestimonials.map((t, index) => (
              <div
                key={index}
                className="testimonial-card"
              >
                <div className="quote-icon"><FaQuoteLeft /></div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <div className="testimonial-author">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

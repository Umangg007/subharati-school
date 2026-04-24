import React from "react";
import { Link } from "react-router-dom";
import { FaSeedling, FaBookOpen, FaPuzzlePiece, FaRocket } from "react-icons/fa";
import "./Highlights.css";

const journeyLevels = [
  {
    icon: <FaSeedling />,
    title: "Foundational Stage",
    grades: "Pre-Primary to Grade 2",
    description: "Play-based learning that builds language, confidence, social habits, and joyful classroom routines.",
    link: "/programs"
  },
  {
    icon: <FaBookOpen />,
    title: "Preparatory Stage",
    grades: "Grade 3 to Grade 5",
    description: "Strong reading, numeracy, and activity-based projects that nurture curiosity and independent thinking.",
    link: "/programs"
  },
  {
    icon: <FaPuzzlePiece />,
    title: "Middle Stage",
    grades: "Grade 6 to Grade 8",
    description: "Balanced academics with co-curricular exposure, teamwork, and practical learning experiences.",
    link: "/programs"
  },
  {
    icon: <FaRocket />,
    title: "Future-Ready Stage",
    grades: "Beyond Classroom Basics",
    description: "Communication, leadership, and values-driven growth that prepares students for the next academic steps.",
    link: "/admission"
  }
];

const Highlights = () => {
  return (
    <section className="highlights-section">
      <div className="section-container">
        <div
          className="section-header"
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: '3rem', color: 'var(--brand-primary)', marginBottom: '20px' }}>The Journey Of Learning</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-soft)', maxWidth: '700px', margin: '0 auto' }}>
            Clear stage-wise progression for parents and students, with age-appropriate learning from foundation to future readiness.
          </p>
        </div>

        <div className="highlights-grid">
          {journeyLevels.map((level, index) => (
            <div
              key={index}
              className="highlight-card"
            >
              <div className="highlight-icon">
                {level.icon}
              </div>
              <h3>{level.title}</h3>
              <p className="highlight-grade">{level.grades}</p>
              <p>{level.description}</p>
              <Link to={level.link} className="highlight-link">Explore</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

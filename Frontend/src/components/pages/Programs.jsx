import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  FaChild,
  FaBookOpen,
  FaSchool,
  FaGraduationCap,
  FaRocket,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaTimes,
  FaClock,
  FaUsers,
  FaAward,
  FaBook,
  FaPalette,
  FaMusic,
  FaCalculator,
  FaFlask,
  FaGlobe
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageHeader from '../common/PageHeader';
import "./Programs.css";

const Programs = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeCategory, setActiveCategory] = useState('pre-primary');

  const handleEnquire = () => {
    navigate('/enquire');
  };

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
  };

  const handleCloseDetail = () => {
    setSelectedProgram(null);
  };



  const programs = [
    {
      id: 'playgroup',
      category: 'pre-primary',
      title: 'Playgroup',
      age: '2.5 - 3.5 years',
      icon: <FaChild />,
      image: '/images/custom_playgroup.jpg',
      description: 'A joyful environment where toddlers learn through play, stories, music, and activities.',
      detailedInfo: {
        duration: '3 hours per day',
        timings: '9:00 AM - 12:00 PM',
        batchSize: '15-20 students',
        curriculum: ['Play-based Learning', 'Story Time', 'Music & Movement', 'Art & Craft', 'Basic Concepts'],
        activities: ['Sensory Play', 'Outdoor Activities', 'Puppet Shows', 'Circle Time', 'Free Play'],
        facilities: ['Safe Play Area', 'Nap Room', 'Activity Room', 'Child-friendly Furniture'],
        brochureUrl: '/brochures/playgroup-brochure.pdf'
      }
    },
    {
      id: 'juniorkg',
      category: 'pre-primary',
      title: 'Junior KG',
      age: '4 - 5 years',
      icon: <FaSchool />,
      image: '/images/custom_juniorkg.jpg',
      description: 'Structured learning with academics, activities, and value-based education for early learners.',
      detailedInfo: {
        duration: '4 hours per day',
        timings: '8:30 AM - 12:30 PM',
        batchSize: '25-30 students',
        curriculum: ['English Fundamentals', 'Mathematics Basics', 'Environmental Studies', 'Hindi', 'Art & Craft'],
        activities: ['Reading Practice', 'Number Games', 'Science Experiments', 'Music & Dance', 'Field Trips'],
        facilities: ['Smart Classrooms', 'Activity Room', 'Play Area', 'Library'],
        brochureUrl: '/brochures/junior-kg-brochure.pdf'
      }
    },
    {
      id: 'seniorkg',
      category: 'pre-primary',
      title: 'Senior KG',
      age: '5 - 6 years',
      icon: <FaGraduationCap />,
      image: '/images/custom_seniorkg.jpg',
      description: 'Advanced kindergarten program preparing children for primary school with comprehensive learning.',
      detailedInfo: {
        duration: '4 hours per day',
        timings: '8:30 AM - 12:30 PM',
        batchSize: '25-30 students',
        curriculum: ['English Reading & Writing', 'Mathematics Concepts', 'Environmental Science', 'Hindi', 'Computer Basics'],
        activities: ['Project Work', 'Educational Tours', 'Sports Activities', 'Cultural Programs', 'Science Club'],
        facilities: ['Smart Classrooms', 'Computer Lab', 'Science Corner', 'Playground'],
        brochureUrl: '/brochures/senior-kg-brochure.pdf'
      }
    },
    {
      id: 'balvatika',
      category: 'pre-primary',
      title: 'Balvatika',
      age: '3.5 - 6.5 years',
      icon: <FaPalette />,
      image: '/images/custom_balvatika.jpg',
      description: 'Traditional Indian preschool system focusing on holistic development through play and learning.',
      detailedInfo: {
        duration: '4 hours per day',
        timings: '9:00 AM - 1:00 PM',
        batchSize: '20-25 students',
        curriculum: ['Language Development', 'Cognitive Skills', 'Social Development', 'Creative Arts', 'Physical Activities'],
        activities: ['Storytelling', 'Traditional Games', 'Art & Craft', 'Music & Movement', 'Nature Activities'],
        facilities: ['Balvatika Room', 'Play Area', 'Activity Center', 'Child-friendly Environment'],
        brochureUrl: '/brochures/balvatika-brochure.pdf'
      }
    },
    {
      id: '1st',
      category: 'primary',
      title: '1st Standard',
      age: '6 - 7 years',
      icon: <FaCalculator />,
      image: '/images/custom_std_1.jpg',
      description: 'Foundation of primary education with focus on basic literacy, numeracy, and conceptual understanding.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '30-35 students',
        curriculum: ['English', 'Mathematics', 'Environmental Studies', 'Hindi', 'Computer Science', 'Art & Craft'],
        activities: ['Sports', 'Music', 'Drawing', 'Storytelling', 'Educational Games'],
        facilities: ['Classroom', 'Playground', 'Activity Room', 'Library'],
        brochureUrl: '/brochures/1st-standard-brochure.pdf'
      }
    },
    {
      id: '2nd',
      category: 'primary',
      title: '2nd Standard',
      age: '7 - 8 years',
      icon: <FaBook />,
      image: '/images/custom_std_2.jpg',
      description: 'Building strong academic foundation with enhanced learning concepts and skill development.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '30-35 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
        activities: ['Sports', 'Music', 'Art', 'Quiz Competition', 'Science Projects'],
        facilities: ['Classroom', 'Science Lab', 'Library', 'Playground'],
        brochureUrl: '/brochures/2nd-standard-brochure.pdf'
      }
    },
    {
      id: '3rd',
      category: 'primary',
      title: '3rd Standard',
      age: '8 - 9 years',
      icon: <FaFlask />,
      image: '/images/custom_std_3.jpg',
      description: 'Progressive learning with introduction to advanced concepts and practical knowledge application.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '30-35 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
        activities: ['Science Experiments', 'Sports', 'Music', 'Art Competition', 'Educational Tours'],
        facilities: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground'],
        brochureUrl: '/brochures/3rd-standard-brochure.pdf'
      }
    },
    {
      id: '4th',
      category: 'primary',
      title: '4th Standard',
      age: '9 - 10 years',
      icon: <FaGlobe />,
      image: '/images/custom_std_4.jpg',
      description: 'Comprehensive education with focus on conceptual clarity and analytical thinking skills.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '30-35 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
        activities: ['Debate Club', 'Science Club', 'Sports Meet', 'Cultural Activities', 'Field Trips'],
        facilities: ['Well-equipped Labs', 'Library', 'Auditorium', 'Sports Ground'],
        brochureUrl: '/brochures/4th-standard-brochure.pdf'
      }
    },
    {
      id: '5th',
      category: 'primary',
      title: '5th Standard',
      age: '10 - 11 years',
      icon: <FaAward />,
      image: '/images/custom_std_5.jpg',
      description: 'Advanced primary education preparing students for middle school with strong academic foundation.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '30-35 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science'],
        activities: ['Leadership Programs', 'Sports', 'Music', 'Art Exhibition', 'Science Fair'],
        facilities: ['Advanced Labs', 'Library', 'Auditorium', 'Computer Lab'],
        brochureUrl: '/brochures/5th-standard-brochure.pdf'
      }
    },
    {
      id: '6th',
      category: 'middle',
      title: '6th Standard',
      age: '11 - 12 years',
      icon: <FaGraduationCap />,
      image: '/images/custom_std_6.jpg',
      description: 'Middle school education with introduction to specialized subjects and enhanced learning methodologies.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '35-40 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education'],
        activities: ['Sports Training', 'Music Classes', 'Art Workshops', 'Science Projects', 'Educational Tours'],
        facilities: ['Science Labs', 'Computer Lab', 'Library', 'Sports Ground', 'Auditorium'],
        brochureUrl: '/brochures/6th-standard-brochure.pdf'
      }
    },
    {
      id: '7th',
      category: 'middle',
      title: '7th Standard',
      age: '12 - 13 years',
      icon: <FaRocket />,
      image: '/images/custom_std_7.jpg',
      description: 'Progressive middle school education focusing on conceptual depth and practical application.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '35-40 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education'],
        activities: ['Competitive Exams Prep', 'Sports Meet', 'Cultural Programs', 'Science Exhibitions', 'Debate Competitions'],
        facilities: ['Well-equipped Labs', 'Digital Library', 'Sports Complex', 'Auditorium'],
        brochureUrl: '/brochures/7th-standard-brochure.pdf'
      }
    },
    {
      id: '8th',
      category: 'middle',
      title: '8th Standard',
      age: '13 - 14 years',
      icon: <FaGraduationCap />,
      image: '/images/custom_std_8.jpg',
      description: 'Senior middle school education preparing students for high school with strong academic foundation.',
      detailedInfo: {
        duration: '6 hours per day',
        timings: '8:00 AM - 2:00 PM',
        batchSize: '35-40 students',
        curriculum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education'],
        activities: ['Career Guidance', 'Leadership Training', 'Sports Championship', 'Science Fair', 'Cultural Fest'],
        facilities: ['Advanced Labs', 'Digital Library', 'Career Guidance Cell', 'Sports Complex'],
        brochureUrl: '/brochures/8th-standard-brochure.pdf'
      }
    },
    {
      id: 'higher',
      category: 'higher',
      title: 'Higher Secondary (9th & 10th)',
      age: '14 - 16 years',
      icon: <FaRocket />,
      image: '/images/custom_std_higher_new.jpg',
      description: 'Advanced education for Classes 9th & 10th with expert faculty guidance and career preparation.',
      isNew: true,
      detailedInfo: {
        duration: '7 hours per day',
        timings: '7:30 AM - 2:30 PM',
        batchSize: '35-40 students',
        curriculum: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Social Studies'],
        activities: ['Career Counseling', 'Competitive Exam Prep', 'Leadership Programs', 'Community Service', 'Research Projects'],
        facilities: ['Advanced Labs', 'Digital Library', 'Career Guidance Cell', 'Seminar Hall'],
        brochureUrl: '/brochures/higher-secondary-brochure.pdf'
      }
    }
  ];

  return (
    <section className="programs-section" style={{ padding: 0 }}>
      <PageHeader 
        title="Our"
        highlightWord="Programs"
        subtitle="Nurturing Every Stage of Learning with Excellence. From Playgroup to Higher Secondary, we provide a structured and supportive environment for holistic growth."
        icon={<><FaGraduationCap /> ACADEMICS</>}
        stats={[
          { value: "4", label: "STAGES OF LEARNING" },
          { value: "1:15", label: "TEACHER-STUDENT RATIO" },
          { value: "100%", label: "ENGAGEMENT" }
        ]}
      />
      <div className="section-container" style={{ paddingTop: '60px' }}>

        {/* Tabs for Program Categories */}
        <motion.div
          className="program-categories"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {['pre-primary', 'primary', 'middle', 'higher'].map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'pre-primary' ? 'Early Years' :
                category === 'primary' ? 'Primary' :
                  category === 'middle' ? 'Middle School' : 'Higher Secondary'}
            </button>
          ))}
        </motion.div>

        {/* Filtered Programs Grid */}
        <div className="all-programs-grid">
          {programs.filter(p => p.category === activeCategory).map((program, index) => (
            <motion.div
              key={program.id}
              className="program-grid-card immersive-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {program.isNew && (
                <div className="new-badge">
                  <FaRocket />
                  <span>NEW</span>
                </div>
              )}
              <div className="card-bg-wrapper">
                <img src={program.image} alt={program.title} className="card-bg-image" />
                <div className="card-overlay"></div>
              </div>
              <div className="program-grid-icon">
                {program.icon}
              </div>
              <div className="program-card-content">
                <h3>{program.title}</h3>
                <h4>{program.age}</h4>
                <p>{program.description}</p>
              </div>
              <div className="program-grid-actions">
                <button
                  className="detail-btn fancy-btn"
                  onClick={() => handleProgramClick(program)}
                >
                  Explore Program
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Announcement */}
        <motion.div
          className="special-announcement"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="announcement-grid">
            <div className="announcement-left">
              <div className="news-badge">LATEST UPDATE</div>
              <h3>Exciting <br />News!</h3>
              <div className="announcement-icon-large">
                <FaRocket />
              </div>
            </div>

            <div className="announcement-right">
              <p className="announcement-lead">
                We are proud to announce that <strong>Subharati has expanded its academic offerings</strong> to include 9th Standard and Higher Secondary education.
              </p>
              <p className="announcement-detail">
                This initiative ensures <strong>continuity of learning</strong>, advanced subject expertise, and a strong academic pathway for our students as they prepare for higher education.
              </p>

              <button
                className="announcement-btn-new"
                onClick={handleEnquire}
              >
                Enquire About Higher Secondary
                <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <motion.div
          className="program-detail-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCloseDetail}
        >
          <motion.div
            className="program-detail-content"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={handleCloseDetail}>
              <FaTimes />
            </button>

            <div className="detail-header">
              <div className="detail-icon">
                {selectedProgram.icon}
              </div>
              <h2>{selectedProgram.title}</h2>
              <h3>{selectedProgram.age}</h3>
              <p>{selectedProgram.description}</p>
            </div>

            <div className="detail-info-grid">
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <h4>Duration</h4>
                  <p>{selectedProgram.detailedInfo.duration}</p>
                </div>
              </div>

              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <h4>Timings</h4>
                  <p>{selectedProgram.detailedInfo.timings}</p>
                </div>
              </div>

              <div className="info-item">
                <FaUsers className="info-icon" />
                <div>
                  <h4>Batch Size</h4>
                  <p>{selectedProgram.detailedInfo.batchSize}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4><FaBook className="section-icon" /> Curriculum</h4>
              <ul>
                {selectedProgram.detailedInfo.curriculum.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4><FaPalette className="section-icon" /> Activities</h4>
              <ul>
                {selectedProgram.detailedInfo.activities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4><FaAward className="section-icon" /> Facilities</h4>
              <ul>
                {selectedProgram.detailedInfo.facilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="enquire-detail-btn"
                onClick={handleEnquire}
              >
                Enquire Now
                <FaArrowRight />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Programs;
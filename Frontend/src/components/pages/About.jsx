import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaChild,
  FaGraduationCap,
  FaUsers,
  FaHeart,
  FaAward,
  FaLightbulb,
  FaRocket,
  FaStar,
  FaSchool,
  FaBookOpen,
  FaPalette,
  FaShieldAlt,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle
} from 'react-icons/fa';
import PageHeader from '../common/PageHeader';
import LightboxImage from '../common/LightboxImage';
import './About.css';
import './About-lightbox.css';

const About = () => {
  const navigate = useNavigate();

  const handleEnquire = () => {
    navigate('/enquire');
  };

  const facultyImages = [
    { 
      src: "/Subharati/gallery/trustee_new.png", 
      alt: "Bharat Kshatria - Trustee",
      title: "Mr. Bharat Kshatria - President, J.L. Trust"
    },
    { 
      src: "/Subharati/gallery/himanshu.png", 
      alt: "Himanshu Parikh - Trustee",
      title: "Mr. Himanshu Parikh - Trustee, J.L. Trust"
    },
    { 
      src: "/Subharati/gallery/priti.png", 
      alt: "Mrs. Priti Shah - Principal",
      title: "Mrs. Priti Shah - Co-Ordinator"
    },
    { 
      src: "/Subharati/gallery/niyati.jpg", 
      alt: "Mrs. Niyati Kalay - Head of Early Years",
      title: "Mrs. Niyati Kalay - Head of Early Years"
    }
  ];

  const storyImages = [
    { 
      src: "/Subharati/gallery/about.jpeg", 
      alt: "About Subharati",
      title: "Subharati Pre Primary School - Our Campus"
    }
  ];
  const features = [
    {
      icon: <FaChild />,
      title: "Child-Centric Approach",
      description: "Every child is unique. We tailor our teaching methods to individual learning styles and paces."
    },
    {
      icon: <FaGraduationCap />,
      title: "Qualified Educators",
      description: "Our passionate teachers are experts in early childhood education and child development."
    },
    {
      icon: <FaHeart />,
      title: "Holistic Development",
      description: "Focusing on academic excellence, social skills, and emotional well-being."
    },
    {
      icon: <FaBookOpen />,
      title: "Modern Curriculum",
      description: "Innovative teaching methods that make learning exciting and effective."
    },
    {
      icon: <FaPalette />,
      title: "Creative Learning",
      description: "Encouraging artistic expression and imaginative thinking through various activities."
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe Environment",
      description: "Your child's safety and well-being are our top priorities in our secure, nurturing space."
    }
  ];

  const stats = [
    { number: "1992", label: "Founded", icon: <FaSchool /> },
    { number: "500+", label: "Students", icon: <FaUsers /> },
    { number: "30+", label: "Years of Excellence", icon: <FaAward /> },
    { number: "100%", label: "Satisfaction", icon: <FaHeart /> }
  ];

  return (
    <section className="about">
      <PageHeader 
        title="Welcome to"
        highlightWord="Subharati"
        subtitle="Nurturing Minds since 1992. Managed by J.L. Trust. We're dedicated to providing a foundational learning experience for your child."
        icon={<><FaInfoCircle /> ABOUT US</>}
        stats={[
          { value: "1992", label: "FOUNDED" },
          { value: "500+", label: "STUDENTS" },
          { value: "30+", label: "YEARS EXCELLENCE" },
          { value: "100%", label: "SATISFACTION" }
        ]}
      />
      <div className="section-container mt-12">
        {/* Leadership & Faculty Showcase */}
        <div className="faculty-section">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Leadership</h2>
            <p className="faculty-subtitle">Guided by visionaries dedicated to excellence in education.</p>
          </motion.div>

          <div className="faculty-grid">
            <motion.div
              className="faculty-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="faculty-image-wrapper">
                <LightboxImage 
                  src="/Subharati/gallery/trustee_new.png" 
                  alt="Bharat Kshatria - Trustee"
                  images={facultyImages}
                  index={0}
                  className="faculty-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' }}
                />
                <div className="faculty-overlay">
                  <div className="faculty-quote">"Our mission is to build a strong foundation of values and education."</div>
                </div>
              </div>
              <div className="faculty-info">
                <h3>Mr. Bharat Kshatria</h3>
                <h4>President, J.L. Trust</h4>
                <div className="faculty-divider"></div>
                <p>Guiding the institution with unwavering dedication to providing world-class educational infrastructure.</p>
              </div>
            </motion.div>

            <motion.div
              className="faculty-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="faculty-image-wrapper">
                <LightboxImage 
                  src="/Subharati/gallery/himanshu.png" 
                  alt="Himanshu Parikh - Trustee"
                  images={facultyImages}
                  index={1}
                  className="faculty-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' }}
                />
                <div className="faculty-overlay">
                  <div className="faculty-quote">"Empowering the next generation through vision, integrity, and lifelong learning."</div>
                </div>
              </div>
              <div className="faculty-info">
                <h3>Mr. Himanshu Parikh</h3>
                <h4>Trustee, J.L. Trust</h4>
                <div className="faculty-divider"></div>
                <p>A visionary leader committed to fostering excellence and innovation in early childhood education.</p>
              </div>
            </motion.div>

            <motion.div
              className="faculty-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="faculty-image-wrapper">
                <LightboxImage 
                  src="/Subharati/gallery/priti.png" 
                  alt="Mrs. Priti Shah - Principal"
                  images={facultyImages}
                  index={2}
                  className="faculty-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' }}
                />
                <div className="faculty-overlay">
                  <div className="faculty-quote">"Education is the passport to the future."</div>
                </div>
              </div>
              <div className="faculty-info">
                <h3>Mrs. Priti Shah</h3>
                <h4>Co-Ordinator</h4>
                <div className="faculty-divider"></div>
                <p>Leading with decades of pedagogical expertise in early childhood development.</p>
              </div>
            </motion.div>

            <motion.div
              className="faculty-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="faculty-image-wrapper">
                <LightboxImage 
                  src="/Subharati/gallery/niyati.jpg" 
                  alt="Mrs. Niyati Kalay - Head of Early Years"
                  images={facultyImages}
                  index={3}
                  className="faculty-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=600&auto=format&fit=crop' }}
                />
                <div className="faculty-overlay">
                  <div className="faculty-quote">"Igniting curiosity with love and patience."</div>
                </div>
              </div>
              <div className="faculty-info">
                <h3>Mrs. Niyati Kalay</h3>
                <h4>Head of Early Years</h4>
                <div className="faculty-divider"></div>
                <p>Specializes in Montessori curriculum mapping and guiding young minds securely.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <div className="story-content">
            <motion.div
              className="story-text"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Our <span className="story-highlight">Story</span></h2>
              <p className="story-text-unique">
                Established in 1992, Subharati Pre Primary School has been a cornerstone of early childhood education in Ahmedabad.
                Our journey began with a simple vision: to create a nurturing environment where children can explore, learn, and grow.
                Over the years, we've grown into a community of passionate educators and curious young minds, all working together
                to create a foundation for lifelong learning and success.
              </p>
            </motion.div>
            <motion.div
              className="story-image"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <LightboxImage 
                src="/Subharati/gallery/about.jpeg" 
                alt="About Subharati"
                images={storyImages}
                index={0}
                className="story-img"
              />
            </motion.div>
          </div>
        </div>

        {/* Features Slider - Infinite Loop */}
        <div className="features-section overflow-hidden">
          <div className="features-header text-center mb-12 max-w-7xl mx-auto px-8">
            <h2 className="section-title !mb-0">The Subharati Difference</h2>
          </div>
          
          <div className="marquee-container">
            <div className="marquee-track">
              {[...features, ...features, ...features].map((feature, index) => (
                <div
                  key={index}
                  className="feature-card shrink-0"
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
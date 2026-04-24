// // const Info = () => {
// //   return (
// //     <section className="info">
// //       <div className="info-card">🎓 Experienced Teachers</div>
// //       <div className="info-card">🏫 Safe & Friendly Campus</div>
// //       <div className="info-card">🎨 Creative Learning</div>
// //       <div className="info-card">📚 Activity Based Education</div>
// // //     </section>
// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { FaGraduationCap, FaShieldAlt, FaHeart, FaBook, FaPalette, FaUsers, FaAward, FaRocket } from 'react-icons/fa';
// // import './Info.css';

// // const Info = () => {
// //   const features = [
// //     {
// //       icon: <FaGraduationCap />, title: "Experienced Teachers",
// //       description: "Our dedicated staff provides personalized attention to each child's unique learning journey.",
// //       color: "#f1c40f"
// //     },
// //     {
// //       icon: <FaShieldAlt />,
// //       title: "Safe Environment",
// //       description: "A secure and nurturing space where your child can learn, play, and grow with confidence.",
// //       color: "#3498db"
// //     },
// //     {
// //       icon: <FaHeart />,
// //       title: "Holistic Development",
// //       description: "Focusing on academic excellence, social skills, and emotional well-being.",
// //       color: "#e74c3c"
// //     },
// //     {
// //       icon: <FaBook />,
// //       title: "Modern Curriculum",
// //       description: "Innovative teaching methods that make learning exciting and effective.",
// //       color: "#9b59b6"
// //     },
// //     {
// //       icon: <FaPalette />,
// //       title: "Creative Learning",
// //       description: "Encouraging artistic expression and imaginative thinking through various activities.",
// //       color: "#2ecc71"
// //     },
// //     {
// //       icon: <FaUsers />,
// //       title: "Small Class Sizes",
// //       description: "Maintaining low student-teacher ratios for better individual attention.",
// //       color: "#f39c12"
// //     }
// //   ];

// //   return (
// //     <section className="info-section">
// //       {/* Decorative Background */}
// //       <div className="info-bg">
// //         <div className="floating-shapes">
// //           <div className="shape shape-1"></div>
// //           <div className="shape shape-2"></div>
// //           <div className="shape shape-3"></div>
// //         </div>
// //       </div>

// //       <div className="container">
// //         <motion.div 
// //           className="section-header"
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6 }}
// //           viewport={{ once: true }}
// //         >
// //           <h2>Why Choose Subharati?</h2>
// //           <p>Discover what makes our school the perfect foundation for your child's future</p>
// //         </motion.div>

// //         <div className="info-grid">
// //           {features.map((feature, index) => (
// //             <motion.div
// //               key={index}
// //               className="info-card"
// //               initial={{ opacity: 0, y: 50 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //               viewport={{ once: true }}
// //               whileHover={{ y: -10, scale: 1.02 }}
// //             >
// //               <div className="icon-wrapper" style={{ color: feature.color }}>
// //                 {feature.icon}
// //               </div>
// //               <h3>{feature.title}</h3>
// //               <p>{feature.description}</p>
// //               <div className="card-glow" style={{ background: feature.color }}></div>
// //             </motion.div>
// //           ))}
// //         </div>

// //         <motion.div 
// //           className="stats-section"
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.4 }}
// //           viewport={{ once: true }}
// //         >
// //           <div className="stat-item">
// //             <FaAward className="stat-icon" />
// //             <div className="stat-content">
// //               <h4>15+ Years</h4>
// //               <p>of Excellence</p>
// //             </div>
// //           </div>
// //           <div className="stat-item">
// //             <FaUsers className="stat-icon" />
// //             <div className="stat-content">
// //               <h4>500+</h4>
// //               <p>Happy Students</p>
// //             </div>
// //           </div>
// //           <div className="stat-item">
// //             <FaRocket className="stat-icon" />
// //             <div className="stat-content">
// //               <h4>100%</h4>
// //               <p>Success Rate</p>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Info;

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaGraduationCap,
//   FaShieldAlt,
//   FaHeart,
//   FaBook,
//   FaPalette,
//   FaUsers,
//   FaAward,
//   FaRocket
// } from "react-icons/fa";
// import "./Info.css";

// const features = [
//   {
//     icon: <FaGraduationCap />,
//     title: "Experienced Teachers",
//     description:
//       "Our dedicated staff provides personalized attention to each child's unique learning journey.",
//     color: "#f1c40f"
//   },
//   {
//     icon: <FaShieldAlt />,
//     title: "Safe Environment",
//     description:
//       "A secure and nurturing space where your child can learn, play, and grow with confidence.",
//     color: "#3498db"
//   },
//   {
//     icon: <FaHeart />,
//     title: "Holistic Development",
//     description:
//       "Focusing on academic excellence, social skills, and emotional well-being.",
//     color: "#e74c3c"
//   },
//   {
//     icon: <FaBook />,
//     title: "Modern Curriculum",
//     description:
//       "Innovative teaching methods that make learning exciting and effective.",
//     color: "#9b59b6"
//   },
//   {
//     icon: <FaPalette />,
//     title: "Creative Learning",
//     description:
//       "Encouraging artistic expression and imaginative thinking through activities.",
//     color: "#2ecc71"
//   },
//   {
//     icon: <FaUsers />,
//     title: "Small Class Sizes",
//     description:
//       "Low student-teacher ratios ensure better individual attention.",
//     color: "#f39c12"
//   }
// ];

// const Info = () => {
//   return (
//     <section className="info-section">
//       <div className="info-bg">
//         <div className="floating-shapes">
//           <div className="shape shape-1" />
//           <div className="shape shape-2" />
//           <div className="shape shape-3" />
//         </div>
//       </div>

//       <div className="container">
//         <motion.div
//           className="section-header"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <h2>Why Choose Subharati?</h2>
//           <p>
//             Discover what makes our school the perfect foundation for your
//             child's future
//           </p>
//         </motion.div>

//         <div className="info-grid">
//           {features.map((item, i) => (
//             <motion.div
//               key={i}
//               className="info-card"
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, delay: i * 0.08 }}
//               viewport={{ once: true }}
//             >
//               <div
//                 className="icon-wrapper"
//                 style={{ color: item.color }}
//               >
//                 {item.icon}
//               </div>
//               <h3>{item.title}</h3>
//               <p>{item.description}</p>
//               <div
//                 className="card-glow"
//                 style={{ "--glow": item.color }}
//               />
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           className="stats-section"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           viewport={{ once: true }}
//         >
//           <div className="stat-item">
//             <FaAward className="stat-icon" />
//             <div>
//               <h4>15+ Years</h4>
//               <p>of Excellence</p>
//             </div>
//           </div>
//           <div className="stat-item">
//             <FaUsers className="stat-icon" />
//             <div>
//               <h4>500+</h4>
//               <p>Happy Students</p>
//             </div>
//           </div>
//           <div className="stat-item">
//             <FaRocket className="stat-icon" />
//             <div>
//               <h4>100%</h4>
//               <p>Success Rate</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Info;

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Heart,
  BookOpenCheck,
  Palette,
  LayoutDashboard,
  Lightbulb
} from "lucide-react";
import "./Info.css";
import Achievements from "./Achievements";

const features = [
  {
    icon: <GraduationCap size={32} />,
    title: "Expert Teachers",
    description: "Dedicated educators providing personalized attention to each child's unique learning journey.",
    color: "#f1c40f",
    stat: "15+ Years"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Safe Campus",
    description: "A secure and nurturing space where children learn, play, and grow with confidence.",
    color: "#3498db",
    stat: "100% Safe"
  },
  {
    icon: <Heart size={32} />,
    title: "Care & Growth",
    description: "Focusing on academic excellence, social skills, and emotional well-being.",
    color: "#e74c3c",
    stat: "Holistic"
  },
  {
    icon: <BookOpenCheck size={32} />,
    title: "Smart Learning",
    description: "Innovative teaching methods that make learning exciting and effective.",
    color: "#9b59b6",
    stat: "Modern"
  },
  {
    icon: <Palette size={32} />,
    title: "Creative Minds",
    description: "Encouraging artistic expression and imaginative thinking through various activities.",
    color: "#2ecc71",
    stat: "Creative"
  },
  {
    icon: <LayoutDashboard size={32} />,
    title: "Smart Classes",
    description: "Technology-enabled classrooms for enhanced learning experiences.",
    color: "#f39c12",
    stat: "1:15 Ratio"
  }
];

const Info = () => {
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    navigate('/enquire');
  };

  return (
    <section className="info-section">
      {/* Animated Background */}
      <div className="info-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Subharati?</h2>
          <p>Discover what makes our school the perfect foundation for your child's future</p>
        </motion.div>

        {/* Features Slider - Infinite Loop */}
        <div className="features-section overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-track">
              {[...features, ...features, ...features].map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card shrink-0"
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{
                y: -20,
                scale: 1.08,
                rotateY: 5,
                boxShadow: `0 30px 60px ${feature.color}50, 0 0 40px ${feature.color}20`,
                transition: {
                  type: "spring",
                  stiffness: 300
                }
              }}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
              }}
            >
              <motion.div
                  className="card-background"
                  style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05, ${feature.color}10)`, opacity: 1 }}
                />

              <motion.div
                  className="icon-wrapper"
                  style={{ color: feature.color, scale: 1, rotate: 0 }}
                  whileHover={{
                  rotate: 360,
                  scale: 1.2,
                  filter: `drop-shadow(0 0 20px ${feature.color}80)`,
                  transition: { duration: 0.6 }
                }}
              >
                {feature.icon}
              </motion.div>

              <motion.div
                  className="feature-stat"
                  style={{ color: feature.color, y: 0, opacity: 1 }}
                >
                {feature.stat}
              </motion.div>

                <motion.h3
                  style={{ y: 0, opacity: 1 }}
                  whileHover={{
                  scale: 1.05,
                  color: feature.color
                }}
              >
                {feature.title}
              </motion.h3>

                <motion.p
                  style={{ y: 0, opacity: 1 }}
                >
                {feature.description}
              </motion.p>

              <motion.div
                className="card-glow"
                style={{ background: feature.color, scale: 1, opacity: 0.6 }}
                whileHover={{
                  scale: 1.5,
                  opacity: 0.8
                }}
              />

              <motion.div
                className="card-border"
                style={{ borderColor: feature.color, opacity: 1 }}
                whileHover={{
                  borderColor: feature.color,
                  borderWidth: "3px"
                }}
              />
            </motion.div>
          ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <Achievements />

        {/* Call to Action */}
        <motion.div
          className="cta-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <Lightbulb className="cta-icon" />
            <h3>Ready to Begin Your Child's Journey?</h3>
            <p>Join hundreds of happy parents who trust Subharati for their child's education</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnrollClick}
            >
              Enroll Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Info;


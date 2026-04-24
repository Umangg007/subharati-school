import { motion } from "framer-motion";
import { FaTrophy, FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import "./Achievements.css";
import AnimatedCounter from "./AnimatedCounter";

const achievements = [
  {
    icon: <FaTrophy />,
    number: 25,
    suffix: "+",
    title: "Awards Won",
    description: "Recognized for excellence in academics, sports, and cultural activities."
  },
  {
    icon: <FaUserGraduate />,
    number: 1000,
    suffix: "+",
    title: "Successful Students",
    description: "Students excelling in higher education and competitive examinations."
  },
  {
    icon: <FaChalkboardTeacher />,
    number: 50,
    suffix: "+",
    title: "Qualified Teachers",
    description: "Experienced and passionate educators shaping young minds."
  },
  {
    icon: <FaSchool />,
    number: 15,
    suffix: "+",
    title: "Years of Excellence",
    description: "Providing quality education with strong values and discipline."
  }
];

const Achievements = () => {
  return (
    <section className="achievements">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Our Achievements
        </motion.h2>

        <div className="achievement-grid">
          {achievements.map((item, index) => (
            <motion.div
              className="achievement-card"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="icon">{item.icon}</div>
              <h3>
                <AnimatedCounter 
                  target={item.number} 
                  suffix={item.suffix} 
                  duration={2000}
                  color="#ffd700"
                />
              </h3>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;

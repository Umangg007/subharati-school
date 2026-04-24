import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const AnimatedCounter = ({ target, suffix = "", duration = 2000, color = "#fff" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && count < target) {
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        setCount((prev) => {
          const next = prev + increment;
          if (next >= target) {
            clearInterval(timer);
            setIsComplete(true);
            return target;
          }
          return next;
        });
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, count, target, duration]);

  return (
    <motion.span 
      ref={counterRef}
      className="counter-wrapper"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: isVisible ? 1 : 0,
        rotate: isVisible ? 0 : -180
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.2
      }}
      style={{ 
        color: color,
        textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`,
        fontWeight: "bold"
      }}
    >
      <motion.span
        animate={{
          scale: isComplete ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.3
        }}
      >
        {Math.floor(count)}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ 
          opacity: isComplete ? 1 : 0,
          x: isComplete ? 0 : -10
        }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {suffix}
      </motion.span>
    </motion.span>
  );
};

export default AnimatedCounter;

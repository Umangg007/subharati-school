import React from 'react';
import { motion } from 'framer-motion';
import './PageHeader.css';

const PageHeader = ({ title, highlightWord, subtitle, stats, icon }) => {
  return (
    <div className="page-header-wrapper">
      <div className="page-header-bg">
        <div className="header-grid-overlay"></div>
      </div>
      
      <div className="page-header-content section-container">
        {icon && (
          <motion.div 
            className="header-icon-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}
        
        <motion.h1 
          className="header-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title} {highlightWord && <span className="header-highlight">{highlightWord}</span>}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            className="header-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        {stats && stats.length > 0 && (
          <motion.div 
            className="header-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="header-stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="header-wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--surface-1)" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default PageHeader;

import React from "react";
// Removed motion import
import "./VisionAndMap.css";

const VisionAndMap = () => {
  return (
    <>
      <section className="vision-section">
        <div className="section-container">
          <div className="vision-content">
            <span className="vision-kicker">Our guiding principles</span>
            <h2>Educational Vision</h2>
            <p>
              At Subharati, we envision creating a nurturing environment where every child discovers their unique potential. 
              We strive to foster curiosity, creativity, and a lifelong love for learning through innovative teaching methods 
               and compassionate guidance. Our goal is to build a foundation of excellence and integrity.
            </p>
            
            <div className="vision-values">
              <div className="value-item">
                <h3>Excellence</h3>
                <p>Pursuing academic rigor and personal growth in every student.</p>
              </div>
              
              <div className="value-item">
                <h3>Integrity</h3>
                <p>Building strong character through fundamental human values.</p>
              </div>
              
              <div className="value-item">
                <h3>Innovation</h3>
                <p>Embracing modern pedagogical methods for better outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default VisionAndMap;

import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="announcement-tag">NEW</span>
        <marquee direction="left" scrollamount="5">
          Admissions Open for Academic Year 2026-27! | Entrance Test Schedule for Class XI is now available. | Scholarship applications for meritorious students are open.
        </marquee>
      </div>
    </div>
  );
};

export default AnnouncementBar;

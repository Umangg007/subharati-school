import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [branch, setBranch] = useState("subharati");

  const quickLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Admission', path: '/admission' },
    { name: 'Enquire Now', path: '/enquire' },
  ];

  const programs = [
    { name: 'Nursery', path: '/programs' },
    { name: 'LKG', path: '/programs' },
    { name: 'UKG', path: '/programs' },
    { name: 'Art & Craft', path: '/programs' },
    { name: 'Outdoor Activities', path: '/programs' },
    { name: 'Smart Classes', path: '/programs' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', url: 'https://facebook.com/' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com/' },
    { icon: <FaYoutube />, name: 'YouTube', url: 'https://youtube.com/' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://twitter.com/' },
  ];

  const branchContent = {
    subharati: "Subharati Pre-Primary & Primary - Maninagar",
    ahbalghar: "A.H Bal Ghar - Branch II",
    dcshah: "D.C Shah School - Branch III"
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* School Info */}
        <div className="footer-col footer-col-info">
          <div className="footer-logo">
            <div>
              <h2>Subharati</h2>
              <small>Educational Excellence</small>
            </div>
          </div>
          <p className="footer-desc">
            Nurturing young minds with love, creativity, and innovation since 1992.
            Part of the renowned J.L. Trust group of educational institutions.
          </p>

          
          <div className="social-row">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-heading">Navigation</h3>
          <ul className="footer-links-list">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div className="footer-col">
          <h3 className="footer-heading">Our Sections</h3>
          <ul className="footer-links-list">
            {programs.map((p) => (
              <li key={p.name}>
                <Link to={p.path}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branch & Map */}
        <div className="footer-col footer-col-map">
          <h3 className="footer-heading">Locate Us</h3>
          <div className="map-container">
            <iframe
              title="school-location"
              src="https://www.google.com/maps?q=Subharati%20Pre%20Primary%20School%20Rambaug%20Maninagar%20Ahmedabad&output=embed"
              width="100%"
              height="150"
              style={{
                border: 0,
                background: 'white',
                borderRadius: '8px'
              }}
              loading="lazy"
            />
          </div>

          <h3 className="footer-heading" style={{ marginTop: '20px', marginBottom: '15px' }}>Our Branches</h3>
          <select
            className="branch-select"
            onChange={(e) => setBranch(e.target.value)}
            value={branch}
          >
            <option value="subharati">Subharati Main Branch</option>
            <option value="ahbalghar">A.H Bal Ghar</option>
            <option value="dcshah">D.C Shah School</option>
          </select>
          <p className="branch-name">{branchContent[branch]}</p>
          <p className="branch-desc">Managed by J.L. Trust — Committed to quality education since decades.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} Subharati Educational Institution. All Rights Reserved.</span>
        <span>Managed by J.L. Trust • Made with <FaHeart className="heart" /> for young minds</span>
      </div>
    </footer>
  );
};

export default Footer;
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import LightboxImage from '../common/LightboxImage';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Navbar logo for lightbox
  const navbarImages = [
    { 
      src: "/Subharati/gallery/logo.jpeg", 
      alt: "Sri Bai Jivkor Lallubhai Trust Logo",
      title: "Subharati Pre Primary School Logo"
    }
  ];
  const isAboutActive =
    location.pathname === '/about' ||
    location.pathname === '/about/infrastructure' ||
    location.pathname === '/about/teachers';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAboutMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAboutMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.body.classList.add("nav-menu-open");
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.classList.remove("nav-menu-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogoClick = () => {
    closeMenu();
    if (location.pathname === "/" || location.pathname === "/home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navItems = [
    { to: "/programs", label: "Programs" },
    { to: "/gallery", label: "Gallery" },
    { to: "/events", label: "Events" },
    { to: "/admission", label: "Admission" },
    { to: "/enquire", label: "Enquire" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "open-menu" : ""}`}>
      {/* Logo */}
      <Link to="/home" className="nav-logo" onClick={handleLogoClick}>
        <LightboxImage 
          src="/Subharati/gallery/logo.jpeg" 
          alt="Sri Bai Jivkor Lallubhai Trust Logo" 
          className="logo-icon-img"
          images={navbarImages}
          index={0}
          showLightbox={false}
        />
        <div className="logo-text">
          <span className="logo-name">Subharati</span>
          <small>Pre Primary School</small>
          <small className="logo-trust">Managed by J.L. Trust</small>
        </div>
      </Link>

      {/* Links */}
      <ul id="primary-navigation" className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/home" end onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li
          className={`nav-dropdown ${aboutMenuOpen ? "open" : ""} ${isAboutActive ? "active" : ""}`}
          onMouseEnter={() => !menuOpen && setAboutMenuOpen(true)}
          onMouseLeave={() => !menuOpen && setAboutMenuOpen(false)}
        >
          <button
            type="button"
            className="nav-dropdown-trigger"
            aria-expanded={aboutMenuOpen}
            onClick={() => setAboutMenuOpen((prev) => !prev)}
          >
            About
            <span className="dropdown-caret" aria-hidden="true"><FaChevronDown /></span>
          </button>
          <ul className="nav-dropdown-menu">
            <li>
              <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
            </li>
            <li>
              <NavLink to="/about/teachers" onClick={closeMenu}>Teachers</NavLink>
            </li>
            <li>
              <NavLink to="/about/infrastructure" onClick={closeMenu}>Infrastructure</NavLink>
            </li>
          </ul>
        </li>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} onClick={closeMenu}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Notices — always visible on desktop */}
      <NavLink to="/notices" className="nav-cta-desktop nav-cta-yellow" onClick={closeMenu}>
        Notices
      </NavLink>

      {/* Hamburger */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      <div className={`nav-overlay ${menuOpen ? "show" : ""}`} onClick={closeMenu} />
    </nav>
  );
};

export default Navbar;

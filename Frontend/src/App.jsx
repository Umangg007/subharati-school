import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import AnnouncementPopup from './components/layout/AnnouncementPopup';
import NoticeBoard from './components/pages/NoticeBoard';
import Events from './components/pages/Events';
import Hero from './components/home/Hero';
import Info from './components/home/Info';
import Highlights from './components/home/Highlights';
import TopStudents from './components/home/TopStudents';
import About from './components/pages/About';
import Infrastructure from './components/pages/Infrastructure';
import Teachers from './components/pages/Teachers';
import Footer from './components/layout/Footer';
import Testimonials from './components/home/Testimonials';
import Gallery from './components/pages/Gallery';
import Admission from './components/pages/Admission';
import Enquire from './components/pages/Enquire';
import Auth from './components/pages/Auth';
import Programs from './components/pages/Programs';
import GalleryPreview from './components/home/GalleryPreview';
import SubharatiPuzzle from './components/home/SubharatiPuzzle';
import SplashScreen from './components/common/SplashScreen';
import AdminDashboard from './admin/AdminDashboard';
import NotFound from './components/pages/NotFound';
import { getAuthToken } from './utils/api';
import { useNavigate } from 'react-router-dom';


const HomePage = () => (
  <>
    <Hero />
    <Info />
    <Highlights />
    <TopStudents />
    <GalleryPreview />
    <Testimonials />
    <SubharatiPuzzle />
    <Footer />
  </>
);

function App() {
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomeRoute = location.pathname === '/home' || location.pathname === '/';

  const pageFlipVariants = {
    initial: {
      opacity: 0,
      y: 34,
      scale: 0.985,
      filter: 'blur(6px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: 0,
      rotate: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 1.01,
      filter: 'blur(4px)'
    }
  };
  const pageTransition = {
    duration: 0.58,
    ease: [0.16, 1, 0.3, 1]
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (showSplash || !isHomeRoute) {
      return;
    }

    const hasSeenPopup = sessionStorage.getItem('hasSeenAnnouncement');
    if (hasSeenPopup) {
      return;
    }

    const popupTimer = setTimeout(() => {
      setIsPopupOpen(true);
      sessionStorage.setItem('hasSeenAnnouncement', 'true');
    }, 2000);

    return () => clearTimeout(popupTimer);
  }, [showSplash, isHomeRoute]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="app">
      {!isAdminRoute && showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!isAdminRoute && !showSplash && <AnnouncementPopup isOpen={isPopupOpen} onClose={closePopup} />}
      {location.pathname !== '/auth' && !isAdminRoute && !showSplash && <Navbar />}
      {isAdminRoute ? (
        <Routes location={location}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      ) : !showSplash ? (
        <div className="page-book-shell">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="page-sheet"
              variants={pageFlipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<><About /><Footer /></>} />
              <Route path="/about/teachers" element={<><Teachers /><Footer /></>} />
              <Route path="/about/infrastructure" element={<><Infrastructure /><Footer /></>} />
              
              <Route path="/programs" element={<><Programs /><Footer /></>} />
              <Route path="/gallery" element={<><Gallery /><Footer /></>} />
              <Route path="/notices" element={<><NoticeBoard /><Footer /></>} />
              <Route path="/events" element={<><Events /><Footer /></>} />
              <Route path="/admission" element={<><Admission /><Footer /></>} />
              <Route path="/enquire" element={<><Enquire /><Footer /></>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      ) : null
      }
    </div>
  );
}

export default App;

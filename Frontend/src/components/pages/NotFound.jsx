import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="text-center z-10">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold text-blue-600"
          >
            404
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl"
          >
            Page not found
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-7 text-gray-600 max-w-lg mx-auto"
          >
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Go back
            </button>
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Back to home
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;

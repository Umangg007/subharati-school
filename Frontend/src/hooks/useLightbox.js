import { useState, useCallback } from 'react';

const useLightbox = (images = []) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index = 0) => {
    if (images.length === 0) return;
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    setIsOpen(true);
  }, [images.length]);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
  }, [images.length]);

  return {
    isOpen,
    currentIndex,
    currentImage: images[currentIndex],
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
    goToImage,
    hasNext: currentIndex < images.length - 1,
    hasPrev: currentIndex > 0,
    totalImages: images.length
  };
};

export default useLightbox;

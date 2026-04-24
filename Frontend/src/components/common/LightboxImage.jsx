import React from 'react';
import Lightbox from './Lightbox';
import useLightbox from '../../hooks/useLightbox';
import './LightboxImage.css';

const LightboxImage = ({ 
  src, 
  alt, 
  className = '', 
  images = [],
  index = 0,
  showLightbox = true,
  lightboxOptions = {}
}) => {
  // If no images array provided, use the single image
  const lightboxImages = images.length > 0 ? images : [{ src, alt, title: alt }];
  
  const {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev
  } = useLightbox(lightboxImages);

  const handleClick = () => {
    if (showLightbox) {
      openLightbox(index);
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`lightbox-image-trigger ${className}`}
        onClick={handleClick}
        style={{ cursor: showLightbox ? 'pointer' : 'default' }}
      />
      
      <Lightbox
        images={lightboxImages}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
        {...lightboxOptions}
      />
    </>
  );
};

export default LightboxImage;

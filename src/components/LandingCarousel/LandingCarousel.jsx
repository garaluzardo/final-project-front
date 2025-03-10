import React, { useState, useEffect } from 'react';
import './LandingCarousel.css';

import Image01 from "../../assets/images/landing01.jpg"
import Image02 from "../../assets/images/landing02.jpg"
import Image03 from "../../assets/images/landing03.JPG"
import Image04 from "../../assets/images/landing04.jpg"
import Image05 from "../../assets/images/landing05.jpg"
import Image06 from "../../assets/images/landing06.jpg"
import Image07 from "../../assets/images/landing07.jpg"
import Image08 from "../../assets/images/landing08.jpg"
import Image09 from "../../assets/images/landing09.jpg"
import Image10 from "../../assets/images/landing10.jpg"

const LandingCarousel = () => {
  // Array de imágenes (puedes reemplazar estas URLs con tus propias imágenes)
  const images = [Image01, Image02, Image03, Image04, Image05, Image06, Image07, Image08, Image09, Image10];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Cambiar la imagen cada 5 segundos
    const interval = setInterval(() => {
      // Iniciar transición
      setIsTransitioning(true);
      
      // Programar la actualización de índices después de que la transición comience
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setNextImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        
        // Resetear el estado de transición
        setTimeout(() => {
          setIsTransitioning(false);
        }, 10);
      }, 1000); // Esperar a que termine la transición de opacidad
      
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="landing-carousel">
      <div 
        className={`carousel-image ${isTransitioning ? 'fade-out' : ''}`} 
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      <div 
        className="carousel-image back-image" 
        style={{ backgroundImage: `url(${images[nextImageIndex]})` }}
      />
    </div>
  );
};

export default LandingCarousel;
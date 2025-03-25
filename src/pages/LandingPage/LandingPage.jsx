import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './LandingPage.css';
import LandingCounter from './components/LandingCounter/LandingCounter';
import Perrito from "../../assets/images/perrito.gif";

const LandingPage = () => {
  // Referencias para los elementos a animar
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const buttonRef = useRef(null);

  // Estilos iniciales para ocultar elementos
  const hiddenStyle = { opacity: 0 };

  // Callback para manejar el mouse enter
  const handleMouseEnter = useCallback(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, { 
        duration: 0.3, 
        scale: 1.1,
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        ease: "power1.out" 
      });
    }
  }, []);

  // Callback para manejar el mouse leave
  const handleMouseLeave = useCallback(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, { 
        duration: 0.3, 
        scale: 1,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        ease: "power1.out" 
      });
    }
  }, []);

  useEffect(() => {
    // Crear timeline para animaciones secuenciales
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Secuencia de animaciones
    tl.to(titleRef.current, { 
      duration: 1, 
      opacity: 1, 
      y: 0,
      delay: 0.2
    })
    .to(subtitleRef.current, { 
      duration: 0.8, 
      opacity: 1, 
      y: 0 
    }, "-=0.6")
    .to(descriptionRef.current, { 
      duration: 0.8, 
      opacity: 1, 
      y: 0 
    }, "-=0.5")
    .to(ctaRef.current, { 
      duration: 0.8, 
      opacity: 1, 
      y: 0 
    }, "-=0.5")
    .to(buttonRef.current, { 
      duration: 0.5, 
      opacity: 1, 
      y: 0,
      scale: 1.05
    }, "-=0.3")
    .to(buttonRef.current, {
      duration: 0.3,
      scale: 1
    });
    
    // Agregar event listeners usando referencias estables
    const currentButton = buttonRef.current;
    if (currentButton) {
      currentButton.addEventListener('mouseenter', handleMouseEnter);
      currentButton.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Limpieza al desmontar
    return () => {
      if (currentButton) {
        currentButton.removeEventListener('mouseenter', handleMouseEnter);
        currentButton.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div className="landing-container">
      {/* Sección 1: Hero */}
      <section className="landing-section">
          <div className="hero-title">
            <h1 ref={titleRef} style={hiddenStyle}>PET<span>PAL</span></h1>
            <h2 ref={subtitleRef} style={hiddenStyle}>Descubre. Conecta. Ayuda.</h2>
            <h3 ref={descriptionRef} style={hiddenStyle}>Nuestra comunidad de voluntarios y protectoras crece cada día, creando una red de apoyo para los animales que más lo necesitan. </h3>
            <h4 ref={ctaRef} style={hiddenStyle}>Únete a una protectora o crea la tuya.</h4>
          </div>
          <div className="landing-buttons">
              <button ref={buttonRef} style={hiddenStyle}>
                <Link to="/access" >
                  Regístrate y entra
                </Link>
              </button>
          </div>
      </section>
      
      {/* Sección 3: Counter */}
      <section className="landing-counter">
        <div className="section-content">
          <h2>Nuestro impacto en cifras.</h2>
          <LandingCounter />
          <img src={Perrito} alt="gif perro" className="perro-gif" />
        </div>
      </section>
      
      {/* Sección 4: Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} PETPAL - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default LandingPage;
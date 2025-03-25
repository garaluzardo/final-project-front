import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    // Crear timeline para animaciones secuenciales
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Ya no necesitamos establecer el estado inicial aquí ya que lo hacemos con CSS
    // gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, ctaRef.current, buttonRef.current], { 
    //   opacity: 0, 
    //   y: 50 
    // });
    
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
    
    // Animación al pasar el cursor por encima del botón
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, { 
          duration: 0.3, 
          scale: 1.1,
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          ease: "power1.out" 
        });
      });
      
      buttonRef.current.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, { 
          duration: 0.3, 
          scale: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          ease: "power1.out" 
        });
      });
    }
    
    // Limpieza al desmontar
    return () => {
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseenter', () => {});
        buttonRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

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
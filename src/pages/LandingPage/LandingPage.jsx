import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LandingCounter from '../../components/LandingCounter/LandingCounter';
import LandingBubbles from '../../components/LandingBubbles/LandingBubbles';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Sección 1: Hero */}
      <section className="landing-section hero-section">
        <div className="section-content">
          <div className="hero-title">
            <h1>PETPAL</h1>
            <h2>Descubre. Conecta. Ayuda.</h2>
            <p>Marca la diferencia en tu comunidad.</p>
          </div>
          
          <div className="hero-columns">
            <div className="hero-column">
              <p>
                Centralizamos todas las protectoras de animales en un solo lugar, 
                facilitando que puedas descubrir, contactar y ofrecer tu ayuda como 
                voluntario. En PETPAL puedes ver, en tiempo real, las necesidades 
                más urgentes de los refugios en tu área y las diferentes formas en 
                que puedes contribuir.
              </p>
            </div>
            <div className="hero-column">
              <p>
                Nuestra comunidad de voluntarios y protectoras crece cada día, 
                creando una red de apoyo para los animales que más lo necesitan. 
                Ya sea donando tiempo, recursos o habilidades específicas, hay 
                muchas maneras de marcar la diferencia.
              </p>
            </div>
          </div>
          
          <div className="hero-cta">
            <span>Regístrate, únete como voluntario a una protectora o crea la tuya.</span>
            <div>
              <Link to="/access" className="btn btn-primary">
                Entra
              </Link>
            </div>
          </div>
        </div>
        
        {/* Divisor ondulado mejorado */}
        <div className="wave-divider-container">
          <svg className="wave-divider wave-divider-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,0 C240,95 480,100 720,85 C960,70 1200,30 1440,70 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Sección 2: Explore */}
      <section className="landing-section explore-section">
        <div className="section-content">
          <h2>Conoce protectoras que necesitan tu ayuda.</h2>
          
          {/* Componente de burbujas flotantes */}
          <div className="floating-shelters-container">
            <LandingBubbles />
          </div>
          
          <Link to="/shelters" className="btn btn-secondary">
            Explora
          </Link>
        </div>
        
        {/* Segundo divisor ondulado mejorado (diferente) */}
        <div className="wave-divider-container-2">
          <svg className="wave-divider wave-divider-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C240,5 480,80 720,60 C960,40 1200,10 1440,30 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Sección 3: Counter */}
      <section className="landing-section counter-section">
        <div className="section-content">
          <h2>Nuestro impacto en cifras. Cada acción cuenta. ¿Te unes?</h2>
          
          {/* Componente de contador */}
          <LandingCounter />
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
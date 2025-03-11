import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LandingCounter from '../../components/LandingCounter/LandingCounter';
import LandingCarousel from '../../components/LandingCarousel/LandingCarousel';
import LandingBubbles from '../../components/LandingBubbles/LandingBubbles';

const LandingPage = () => {
  return (
    <div className="landing-container">
    
      <div className="landing-content">
        {/* El carrusel se coloca dentro del contenido como fondo */}
        <LandingCarousel />
        
        {/* Estructura de dos columnas: texto a la izquierda, botones a la derecha */}
        <div className="content-overlay">
          <div className="content-text">
            <h1>PETPAL</h1>
            <h2>Conecta con refugios que necesitan tu ayuda.</h2>
            <p>
              Centralizamos todas las protectoras de animales en un solo lugar, 
              facilitando que puedas descubrir, contactar y ofrecer tu ayuda como 
              voluntario. En PETPAL puedes ver, en tiempo real, las necesidades 
              más urgentes de los refugios en tu área y las diferentes formas en 
              que puedes contribuir.
            </p>
            <p>
              Nuestra comunidad de voluntarios y protectoras crece cada día, 
              creando una red de apoyo para los animales que más lo necesitan. 
              Ya sea donando tiempo, recursos o habilidades específicas, hay 
              muchas maneras de marcar la diferencia.
            </p>
            <p>
              Regístrate, únete como voluntario a una protectora o crea la tuya.
            </p>
          </div>
          <div className="landing-buttons">
            <Link to="/shelters" className="button-shelters">
              <button>Explora</button>
            </Link>
            <Link to="/access" className="button-access">
              <button>Únete</button>
            </Link>
          </div>
        </div>
        <hr />
      </div>
      <hr />
       {/* Nueva sección con burbujas flotantes */}
       <section className="explore-section">
        <h2>Descubre protectoras increíbles</h2>
        <p>Conéctate con refugios de animales y marca la diferencia en tu comunidad</p>
        
        {/* Componente de burbujas flotantes */}
        <LandingBubbles />
        
        <Link to="/shelters" className="explore-button">
          Explora las protectoras disponibles
        </Link>
      </section>
      <hr />
      <LandingCounter />
      <hr />

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} PETPAL - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default LandingPage;
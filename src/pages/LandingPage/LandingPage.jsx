import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import LandingCounter from '../../components/LandingCounter/LandingCounter';
import Perrito from "../../assets/images/perrito.gif";
/* import LandingBubbles from '../../components/LandingBubbles/LandingBubbles'; */
/* import LogoBN from "../../assets/images/logo-bn.png"; */

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Sección 1: Hero */}
      <section className="landing-section">
          <div className="hero-title">
            <h1>PET<span>PAL</span></h1>
            <h2>Descubre. Conecta. Ayuda.</h2>
            <h3>Nuestra comunidad de voluntarios y protectoras crece cada día, creando una red de apoyo para los animales que más lo necesitan. </h3>
            <h4>Únete a una protectora o crea la tuya.</h4>
          </div>
          <div className="landing-buttons">
              <button>
                <Link to="/access" >
                  Regístrate y entra
                </Link>
              </button>
{/*               <button>
              <Link to="/shelters">
                Explora
              </Link>
              </button> */}
            </div>
           
      </section>
      
      {/* Sección 2: Explore */}
{/*       <section className="landing-explore-section">
        <div className="section-content">
          <h2>Conoce protectoras que necesitan tu ayuda.</h2>
          <h2>Marca la diferencia en tu comunidad.</h2>
          <div className="floating-shelters-container">
            <LandingBubbles />
          </div>
          <Link to="/shelters" className="btn btn-secondary">
            Explora
          </Link>
        </div>
      </section> */}
      
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
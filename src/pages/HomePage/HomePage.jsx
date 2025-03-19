import React from 'react';
import JoinedShelters from './components/JoinedShelters/JoinedShelters';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page-grid">
      <div className="home-page-left-column">
        <div className="home-page-section joined-shelters-section">
          <JoinedShelters />
        </div>
        
        <div className="home-page-footer">
          <div className="footer-links">
            <a href="/*">Privacy</a>
            <span>·</span>
            <a href="/*">Terms</a>
            <span>·</span>
            <a href="/*">Cookies</a>
            <span>·</span>
            <a href="/*">About</a>
            <span>·</span>
            <span>PETPAL © 2025</span>
          </div>
        </div>
      </div>
      
      <div className="home-page-center-column">
        {/* Espacio para futuras implementaciones */}
        <div className="future-feed-placeholder">
          <p>Próximamente: Feed de novedades y actividades</p>
        </div>
      </div>
      
      <div className="home-page-right-column">
        <div className="home-page-section news-section">
          <h2>Noticias</h2>
          <div className="news-list">
            <article className="news-item">
              <h3>Nueva protectora en Madrid</h3>
              <p>Se inaugura una protectora especializada en perros senior.</p>
            </article>
            <article className="news-item">
              <h3>Campaña de adopción</h3>
              <p>Este mes, 20 animales buscan un hogar.</p>
            </article>
          </div>
        </div>
        
        <div className="home-page-section messages-section">
          <h2>Mensajes</h2>
          <div className="messages-list">
            <div className="message-item">
              <div className="message-sender">Juan Pérez</div>
              <div className="message-preview">¿Nos vemos este sábado en la protectora?</div>
            </div>
            <div className="message-item">
              <div className="message-sender">Protectora AnimalSOS</div>
              <div className="message-preview">Necesitamos voluntarios urgente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
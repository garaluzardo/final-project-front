import React from 'react';
import { Link } from 'react-router-dom';
import './ShelterCard.css';

const ShelterCard = ({ shelter }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `Miembro desde ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format location
  const formatLocation = (location) => {
    if (!location) return "Sin ubicación";
    
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.municipality) parts.push(location.municipality);
    if (location.province) parts.push(location.province);
    
    return parts.length > 0 ? parts.join(', ') : "Sin ubicación";
  };

  return (
    <article className="shelter-card">
      <div className="article-wrapper">
        <figure>
          {shelter.imageUrl ? (
            <img src={shelter.imageUrl} alt={shelter.name} />
          ) : (
            <div className="default-image">
              {shelter.name.charAt(0).toUpperCase()}
            </div>
          )}
        </figure>
        <div className="article-body">
          <h2>{shelter.name}</h2>
          <p className="shelter-handle">@{shelter.handle}</p>
          <p className="shelter-bio">{shelter.bio}</p>
          <div className="shelter-meta">
            <div className="shelter-location">
              <svg xmlns="http://www.w3.org/2000/svg" className="location-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{formatLocation(shelter.location)}</span>
            </div>
            <div className="shelter-date">
              <svg xmlns="http://www.w3.org/2000/svg" className="date-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(shelter.createdAt)}</span>
            </div>
          </div>
          <div className="shelter-stats">
            <div className="stat">
              <span className="stat-value">{shelter.volunteers?.length || 0}</span>
              <span className="stat-label">Voluntarios</span>
            </div>
            <div className="stat">
              <span className="stat-value">{shelter.animals?.length || 0}</span>
              <span className="stat-label">Animales</span>
            </div>
          </div>
          <Link to={`/shelters/${shelter.handle}`} className="read-more">
            Ver perfil <span className="sr-only">de {shelter.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ShelterCard;
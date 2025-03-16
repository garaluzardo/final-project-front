import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/auth.context';
import { useShelterMembership } from '../../../../hooks/useShelterMembership';
import './ShelterCard.css';

function ShelterCard({ shelter, onUpdate }) {
  const { isLoggedIn } = useContext(AuthContext);
  const { 
    isAdmin, 
    isVolunteer, 
    isJoining, 
    isLeaving, 
    handleJoin, 
    handleLeave 
  } = useShelterMembership(shelter, onUpdate);
  
  // Calcular el número total de voluntarios y animales
  const volunteersCount = shelter.volunteers?.length || 0;
  const animalsCount = shelter.animals?.length || 0;

  // Obtener la ubicación formateada
  const location = typeof shelter.location === 'object' 
    ? shelter.location.city || shelter.location.municipality || shelter.location.province || 'Sin ubicación'
    : shelter.location || 'Sin ubicación';

  // Formatear fecha de creación
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `Se unió en ${months[date.getMonth()]} del ${date.getFullYear()}`;
  };

  return (
    <div className="shelter-card">
      <Link to={`/shelters/${shelter.handle}`} className="shelter-card-content">
        <div className="shelter-avatar">
          {shelter.imageUrl ? (
            <img src={shelter.imageUrl} alt={shelter.name} />
          ) : (
            <div className="default-avatar">
              {shelter.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h3 className="shelter-name">{shelter.name}</h3>
        <p className="shelter-handle">@{shelter.handle}</p>
        
        <p className="shelter-location">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            style={{ marginRight: '5px', verticalAlign: 'middle' }}
          >
            <path 
              d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          {location}
        </p>
        
        <p className="shelter-joined">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            style={{ marginRight: '5px', verticalAlign: 'middle' }}
          >
            <path 
              d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          {shelter.createdAt ? formatDate(shelter.createdAt) : "Fecha desconocida"}
        </p>
        
        {/* Enlace al sitio web si existe */}
        {shelter.contact?.website && (
          <p className="shelter-website">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ marginRight: '5px', verticalAlign: 'middle' }}
            >
              <path 
                d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
            </svg>
            <a 
              href={shelter.contact.website.startsWith('http') ? shelter.contact.website : `https://${shelter.contact.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
              onClick={(e) => e.stopPropagation()}
            >
              {shelter.contact.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
            </a>
          </p>
        )}
        
        <p className="shelter-bio">{shelter.bio}</p>
        
        <div className="shelter-stats">
          <div className="stat">
            <span className="stat-number">{volunteersCount}</span>
            <span className="stat-label">Voluntarios</span>
          </div>
          <div className="stat">
            <span className="stat-number">{animalsCount}</span>
            <span className="stat-label">Mascotas</span>
          </div>
        </div>
      </Link>
      
      {/* Botones de acción (solo para usuarios autenticados) */}
      {isLoggedIn && !isAdmin && (
        <div className="shelter-actions">
          {isVolunteer ? (
            <button 
              onClick={handleLeave} 
              className="action-button leave"
              disabled={isLeaving}
            >
              {isLeaving ? "Abandonando..." : "Abandonar"}
            </button>
          ) : (
            <button 
              onClick={handleJoin} 
              className="action-button join"
              disabled={isJoining}
            >
              {isJoining ? "Uniéndose..." : "Unirse"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShelterCard;
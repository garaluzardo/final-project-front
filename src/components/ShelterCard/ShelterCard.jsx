import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import shelterService from '../../services/shelter.service';
import './ShelterCard.css';

function ShelterCard({ shelter, onUpdate }) {
  const { isLoggedIn, user } = useContext(AuthContext);
  
  // Verificar si el usuario es miembro o admin
  const isAdmin = user && shelter.admins?.some(admin => admin._id === user._id);
  const isMember = user && shelter.volunteers?.some(volunteer => volunteer._id === user._id);
  
  const handleJoin = async () => {
    try {
      await shelterService.joinShelter(shelter._id);
      if (onUpdate) onUpdate(); // Recargar datos después de unirse
    } catch (error) {
      console.error("Error al unirse a la protectora:", error);
    }
  };
  
  const handleLeave = async () => {
    try {
      await shelterService.leaveShelter(shelter._id);
      if (onUpdate) onUpdate(); // Recargar datos después de abandonar
    } catch (error) {
      console.error("Error al abandonar la protectora:", error);
    }
  };
  
  // Truncar la bio si es muy larga
  const truncateBio = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="shelter-card">
      <Link to={`/protectoras/${shelter.handle}`} className="shelter-card-content">
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
          <span role="img" aria-label="location">📍</span> {shelter.location || "Sin ubicación"}
        </p>
        
        <p className="shelter-bio">{truncateBio(shelter.bio)}</p>
        
        <div className="shelter-stats">
          <div className="stat">
            <span className="stat-number">{shelter.admins?.length || 0}</span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat">
            <span className="stat-number">{shelter.volunteers?.length || 0}</span>
            <span className="stat-label">Voluntarios</span>
          </div>
          <div className="stat">
            <span className="stat-number">{shelter.animals?.length || 0}</span>
            <span className="stat-label">Mascotas</span>
          </div>
        </div>
      </Link>
      
      {isLoggedIn && !isAdmin && (
        <div className="shelter-actions">
          {isMember ? (
            <button 
              onClick={handleLeave} 
              className="action-button leave"
            >
              Abandonar
            </button>
          ) : (
            <button 
              onClick={handleJoin} 
              className="action-button join"
            >
              Unirse
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShelterCard;
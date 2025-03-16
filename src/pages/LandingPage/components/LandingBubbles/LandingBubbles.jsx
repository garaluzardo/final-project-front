import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import shelterService from '../../services/shelter.service';
import './LandingBubbles.css';

const LandingBubbles = () => {
  const [shelters, setShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await shelterService.getAllShelters();
        // Limitar a 5 protectoras
        const shownShelters = response.data.slice(0, 5);
        setShelters(shownShelters);
        setIsLoading(false);
      } catch (error) {
        console.error("Error obteniendo protectoras:", error);
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, []);

  if (isLoading || shelters.length === 0) {
    return null;
  }

  return (
    <div className="floating-shelters-container">
      <div className="shelter-bubbles-row">
        {shelters.map(shelter => (
          <Link 
            to={`/shelters/${shelter.handle}`} 
            key={shelter._id} 
            className="shelter-bubble"
          >
            {shelter.imageUrl ? (
              <img src={shelter.imageUrl} alt={shelter.name} />
            ) : (
              <div className="default-bubble">
                {shelter.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="bubble-tooltip">{shelter.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LandingBubbles;
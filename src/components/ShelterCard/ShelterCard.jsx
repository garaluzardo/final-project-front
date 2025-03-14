

import React from 'react';
import { Link } from 'react-router-dom';
import shelterService from '../../services/shelter.service';
import './ShelterCard.css';

function ShelterCard({ shelter }) {
  return (
    <div className="shelter-card">
      <Link to={`/shelters/${shelter.handle}`}>
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
        <p className="shelter-location">{shelter.location}</p>
        <p className="shelter-bio">{shelter.bio}</p>
      </Link>
    </div>
  );
}

export default ShelterCard;
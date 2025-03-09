import React from 'react';
import ShelterCard from '../ShelterCard/ShelterCard';
import './SheltersList.css';

function SheltersList({ shelters, onUpdate }) {
  if (!shelters || shelters.length === 0) {
    return (
      <div className="no-shelters">
        <p>No hay protectoras para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="shelters-list">
      {shelters.map(shelter => (
        <ShelterCard
          key={shelter._id}
          shelter={shelter}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default SheltersList;
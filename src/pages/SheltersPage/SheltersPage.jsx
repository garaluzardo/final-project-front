import React, { useState, useEffect } from 'react';
import SheltersList from "./components/SheltersList/SheltersList";
import shelterService from '../../services/shelter.service';
import './SheltersPage.css';

function SheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todas las protectoras al montar el componente
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await shelterService.getAllShelters();
        setShelters(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching shelters:", error);
        setError("No se pudieron cargar las protectoras");
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, []);

  // Función para actualizar la lista después de unirse/dejar una protectora
  const handleShelterUpdate = async () => {
    try {
      const response = await shelterService.getAllShelters();
      setShelters(response.data);
    } catch (error) {
      console.error("Error updating shelters:", error);
    }
  };

  // Renderizar loading o error si es necesario
  if (isLoading) {
    return (
      <div className="shelters-loading">
        <p>Cargando protectoras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shelters-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="shelters-page">
      <div className="shelters-header">
        <h1>Protectoras</h1>
      </div>

      {shelters.length === 0 ? (
        <div className="no-shelters">
          <p>No hay protectoras disponibles en este momento.</p>
        </div>
      ) : (
        <SheltersList 
          shelters={shelters}
          onUpdate={handleShelterUpdate}
        />
      )}
    </div>
  );
}

export default SheltersPage;
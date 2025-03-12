import React, { useState, useEffect } from 'react';
import SheltersList from "../../components/SheltersList/SheltersList";
import shelterService from '../../services/shelter.service';
import './SheltersPage.css';

function SheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todas las protectoras al montar el componente
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await shelterService.getAllShelters();
        setShelters(response.data);
        setFilteredShelters(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching shelters:", error);
        setError("No se pudieron cargar las protectoras");
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, []);

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filtrar protectoras por ubicación o nombre
    const filtered = shelters.filter(shelter => 
      shelter.location.toLowerCase().includes(term) ||
      shelter.name.toLowerCase().includes(term)
    );

    setFilteredShelters(filtered);
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
        <div className="shelters-search">
          <input 
            type="text" 
            placeholder="Buscar por ubicación o nombre" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {filteredShelters.length === 0 ? (
        <div className="no-shelters">
          <p>No se encontraron protectoras que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <SheltersList 
          shelters={filteredShelters}
          onUpdate={() => {
            // Método para recargar la lista si es necesario
            // Por ejemplo, después de unirse/abandonar una protectora
          }}
        />
      )}
    </div>
  );
}

export default SheltersPage;

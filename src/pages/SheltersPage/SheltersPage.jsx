import React, { useState, useEffect } from 'react';
import SheltersList from "./components/SheltersList/SheltersList";
import SheltersSearch from "./components/SheltersSearch/SheltersSearch";
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

  // Filtrar protectoras cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShelters(shelters);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = shelters.filter(shelter => 
      shelter.name.toLowerCase().includes(lowerCaseSearch) ||
      shelter.handle.toLowerCase().includes(lowerCaseSearch) ||
      (shelter.location?.city && shelter.location.city.toLowerCase().includes(lowerCaseSearch)) ||
      (shelter.location?.municipality && shelter.location.municipality.toLowerCase().includes(lowerCaseSearch)) ||
      (shelter.location?.province && shelter.location.province.toLowerCase().includes(lowerCaseSearch)) ||
      (shelter.location?.island && shelter.location.island.toLowerCase().includes(lowerCaseSearch))
    );

    setFilteredShelters(filtered);
  }, [searchTerm, shelters]);

  // Función para actualizar la lista después de unirse/dejar una protectora
  const handleShelterUpdate = async () => {
    try {
      const response = await shelterService.getAllShelters();
      setShelters(response.data);
      
      // Mantener el filtro de búsqueda cuando se actualiza la lista
      if (searchTerm.trim() !== '') {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = response.data.filter(shelter => 
          shelter.name.toLowerCase().includes(lowerCaseSearch) ||
          shelter.handle.toLowerCase().includes(lowerCaseSearch) ||
          (shelter.location?.city && shelter.location.city.toLowerCase().includes(lowerCaseSearch)) ||
          (shelter.location?.municipality && shelter.location.municipality.toLowerCase().includes(lowerCaseSearch)) ||
          (shelter.location?.province && shelter.location.province.toLowerCase().includes(lowerCaseSearch)) ||
          (shelter.location?.island && shelter.location.island.toLowerCase().includes(lowerCaseSearch))
        );
        setFilteredShelters(filtered);
      } else {
        setFilteredShelters(response.data);
      }
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
        <SheltersSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </div>

      {filteredShelters.length === 0 ? (
        <div className="no-shelters">
          {searchTerm ? (
            <p>No se encontraron protectoras con "{searchTerm}"</p>
          ) : (
            <p>No hay protectoras disponibles en este momento.</p>
          )}
        </div>
      ) : (
        <SheltersList 
          shelters={filteredShelters}
          onUpdate={handleShelterUpdate}
        />
      )}
    </div>
  );
}

export default SheltersPage;
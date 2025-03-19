import React from 'react';
import './SheltersSearch.css';

function SheltersSearch({ searchTerm, setSearchTerm }) {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="shelters-search-container">
      <div className="search-wrapper">
        <div className="search-icon">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar protectoras por: nombre, nombre de usuario, municipio, ciudad, provincia o isla"
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-button" onClick={handleClear}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default SheltersSearch;
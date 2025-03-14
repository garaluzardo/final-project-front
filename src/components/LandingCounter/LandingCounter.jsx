import React, { useState, useEffect } from 'react';
import statsService from '../../services/stats.service';
import "./LandingCounter.css";

const LandingCounter = () => {
  // Estados para los contadores
  const [voluntarios, setVoluntarios] = useState(0);
  const [protectoras, setProtectoras] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos reales del backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await statsService.getGeneralStats();
        setVoluntarios(stats.usersCount || 0);
        setProtectoras(stats.sheltersCount || 0);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        // Establecer valores predeterminados en caso de error
        setVoluntarios(0);
        setProtectoras(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Actualizar cada 60 segundos
    const interval = setInterval(fetchStats, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para convertir un número a un array de dígitos
  const getDigits = (number) => {
    return number.toString().split('').map(Number);
  };

  // Mostrar un loader mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="counter-container loading">
        <div className="counter-loading">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="counter-container">
      <div className="counter-wrapper">
        <div className="counter-row">

          {/* Voluntarios */}
          <div className="counter-column">
            <div className="counter-digits">
              {getDigits(voluntarios).map((digit, index) => (
                <span key={index} className="counter-digit">
                  {digit}
                </span>
              ))}
            </div>
            <div className="counter-label">Voluntarios Registrados</div>
          </div>

          {/* Protectoras */}
          <div className="counter-column">
            <div className="counter-digits">
              {getDigits(protectoras).map((digit, index) => (
                <span key={index} className="counter-digit">
                  {digit}
                </span>
              ))}
            </div>
            <div className="counter-label">Protectoras Creadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCounter;
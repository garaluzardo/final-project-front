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

    // Actualizar cada 60 segundos en principio, pendiente buscar la manera de que solo se actualice cuando exista un cambio en el back)
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para convertir un número a un array de dígitos
  const getDigits = (number) => {
    return number.toString().split('').map(Number);
  };

  // Mostrar un loader mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-row justify-center items-center gap-10">
          {/* Voluntarios */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-1">
              {getDigits(voluntarios).map((digit, index) => (
                <span key={index} className="countdown font-mono text-4xl text-white">
                  <span style={{"--value": digit}} aria-live="polite" aria-label={digit.toString()}>{digit}</span>
                </span>
              ))}
            </div>
            <div className="text-lg text-white mt-2">Voluntarios Registrados</div>
          </div>
          
          {/* Protectoras */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-1">
              {getDigits(protectoras).map((digit, index) => (
                <span key={index} className="countdown font-mono text-4xl text-white">
                  <span style={{"--value": digit}} aria-live="polite" aria-label={digit.toString()}>{digit}</span>
                </span>
              ))}
            </div>
            <div className="text-lg text-white mt-2">Protectoras Creadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCounter;
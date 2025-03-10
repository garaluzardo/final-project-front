import React, { useState, useEffect } from 'react';
import "./LandingCounter.css"

const LandingCounter = () => {
  // Definimos los contadores iniciales
  const [voluntarios, setVoluntarios] = useState(156);
  const [protectoras, setProtectoras] = useState(42);

  // Simulamos incrementos aleatorios en los contadores
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setVoluntarios(prev => prev + 1);
      if (Math.random() > 0.8) setProtectoras(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Función para convertir un número a un array de dígitos
  const getDigits = (number) => {
    return number.toString().split('').map(Number);
  };

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
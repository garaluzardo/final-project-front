import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import shelterService from '../../services/shelter.service';
import './LandingBubbles.css';

const LandingBubbles = () => {
  const [shelters, setShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  const animationRef = useRef(null);
  
  // Estado para las posiciones y velocidades de las burbujas
  const [bubblePositions, setBubblePositions] = useState([]);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await shelterService.getAllShelters();
        // Tomar hasta 7 protectoras para mostrar
        const shownShelters = response.data.slice(0, 7);
        setShelters(shownShelters);
        setIsLoading(false);
        
        // Inicializar posiciones si hay protectoras
        if (shownShelters.length > 0) {
          initializeBubblePositions(shownShelters.length);
        }
      } catch (error) {
        console.error("Error obteniendo protectoras:", error);
        setIsLoading(false);
      }
    };

    fetchShelters();
    
    // Limpieza al desmontar el componente
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Inicializa las posiciones de las burbujas de forma que no se superpongan
  const initializeBubblePositions = (count) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const newPositions = [];
    const sizes = ['small', 'medium', 'large'];
    const bubbleSizes = {
      small: 50,
      medium: 70,
      large: 90
    };
    
    // Función para verificar si una nueva posición colisiona con existentes
    const checkCollision = (x, y, size) => {
      const radius = bubbleSizes[size] / 2;
      
      for (const pos of newPositions) {
        const otherRadius = bubbleSizes[pos.size] / 2;
        const minDistance = radius + otherRadius + 10; // 10px extra de margen
        
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          return true; // Hay colisión
        }
      }
      
      return false; // No hay colisión
    };
    
    // Crear posiciones para cada burbuja
    for (let i = 0; i < count; i++) {
      const size = sizes[i % sizes.length];
      const radius = bubbleSizes[size] / 2;
      
      // Intentar encontrar una posición sin colisiones
      let attempts = 0;
      let x, y;
      
      do {
        // Posición aleatoria dentro de los límites del contenedor
        x = radius + Math.random() * (containerWidth - 2 * radius);
        y = radius + Math.random() * (containerHeight - 2 * radius);
        attempts++;
      } while (checkCollision(x, y, size) && attempts < 100);
      
      // Velocidad aleatoria REALMENTE lenta
      const speedFactor = 0.15; // Factor muy bajo para velocidad inicial
      const vx = (Math.random() * 2 - 1) * speedFactor;
      const vy = (Math.random() * 2 - 1) * speedFactor;
      
      newPositions.push({
        x,
        y,
        vx,
        vy,
        size,
        radius,
        lastCollision: 0 // Timestamp de la última colisión
      });
    }
    
    setBubblePositions(newPositions);
    
    // Iniciar la animación
    animateBubbles(newPositions);
  };
  
  // Limita la velocidad a un valor máximo
  const limitSpeed = (vx, vy) => {
    const MAX_SPEED = 0.5; // Velocidad máxima permitida
    
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > MAX_SPEED) {
      // Normalizar el vector de velocidad y multiplicar por la velocidad máxima
      return {
        vx: (vx / speed) * MAX_SPEED,
        vy: (vy / speed) * MAX_SPEED
      };
    }
    
    return { vx, vy };
  };
  
  // Anima las burbujas
  const animateBubbles = (positions) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Contador para normalización periódica
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      
      // Cada 100 frames, estabilizar todas las velocidades
      const shouldStabilize = frameCount % 100 === 0;
      
      const updatedPositions = positions.map((bubble, index) => {
        let { x, y, vx, vy, radius } = bubble;
        
        // Estabilizar velocidad periódicamente
        if (shouldStabilize) {
          const stabilizationFactor = 0.9; // Reducir velocidad periódicamente
          vx *= stabilizationFactor;
          vy *= stabilizationFactor;
          
          // Asegurar una velocidad mínima para mantener movimiento
          const minSpeed = 0.05;
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          
          if (currentSpeed < minSpeed) {
            const angle = Math.random() * Math.PI * 2;
            vx = Math.cos(angle) * minSpeed;
            vy = Math.sin(angle) * minSpeed;
          }
        }
        
        // Limitar velocidad máxima
        const limitedSpeed = limitSpeed(vx, vy);
        vx = limitedSpeed.vx;
        vy = limitedSpeed.vy;
        
        // Actualizar posición
        x += vx;
        y += vy;
        
        // Rebotar en los bordes (con amortiguación)
        const dampingFactor = 0.8; // Reducir velocidad al rebotar
        
        if (x - radius < 0) {
          vx = Math.abs(vx) * dampingFactor;
          x = radius;
        } else if (x + radius > containerWidth) {
          vx = -Math.abs(vx) * dampingFactor;
          x = containerWidth - radius;
        }
        
        if (y - radius < 0) {
          vy = Math.abs(vy) * dampingFactor;
          y = radius;
        } else if (y + radius > containerHeight) {
          vy = -Math.abs(vy) * dampingFactor;
          y = containerHeight - radius;
        }
        
        // Actualizar elemento DOM
        if (bubblesRef.current[index]) {
          bubblesRef.current[index].style.left = `${x - radius}px`;
          bubblesRef.current[index].style.top = `${y - radius}px`;
        }
        
        return { ...bubble, x, y, vx, vy };
      });
      
      // Verificar colisiones entre burbujas
      const now = Date.now();
      const COLLISION_COOLDOWN = 500; // Tiempo mínimo entre colisiones (ms)
      
      for (let i = 0; i < updatedPositions.length; i++) {
        for (let j = i + 1; j < updatedPositions.length; j++) {
          const b1 = updatedPositions[i];
          const b2 = updatedPositions[j];
          
          const dx = b1.x - b2.x;
          const dy = b1.y - b2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Si hay colisión
          if (distance < b1.radius + b2.radius) {
            // Verificar cooldown para evitar múltiples colisiones consecutivas
            const canCollide1 = now - b1.lastCollision > COLLISION_COOLDOWN;
            const canCollide2 = now - b2.lastCollision > COLLISION_COOLDOWN;
            
            if (canCollide1 && canCollide2) {
              // Marcar timestamp de colisión
              b1.lastCollision = now;
              b2.lastCollision = now;
              
              // Calcular vector de colisión normalizado
              const nx = dx / distance;
              const ny = dy / distance;
              
              // Calcular vector de rebote con fuerte amortiguación
              const bounceFactor = 0.3; // Amortiguar mucho el rebote
              
              // Intercambiar componentes de velocidad (conservación de momento)
              const p1 = 2 * (b1.vx * nx + b1.vy * ny);
              const p2 = 2 * (b2.vx * nx + b2.vy * ny);
              
              b1.vx = (b1.vx - p1 * nx) * bounceFactor;
              b1.vy = (b1.vy - p1 * ny) * bounceFactor;
              b2.vx = (b2.vx + p2 * nx) * bounceFactor;
              b2.vy = (b2.vy + p2 * ny) * bounceFactor;
              
              // Limitar velocidades después de colisión
              const limited1 = limitSpeed(b1.vx, b1.vy);
              const limited2 = limitSpeed(b2.vx, b2.vy);
              
              b1.vx = limited1.vx;
              b1.vy = limited1.vy;
              b2.vx = limited2.vx;
              b2.vy = limited2.vy;
              
              // Separar las burbujas con margen extra para evitar que se queden atrapadas
              const overlap = b1.radius + b2.radius - distance + 3;
              const moveX = (overlap * nx) / 2;
              const moveY = (overlap * ny) / 2;
              
              b1.x += moveX;
              b1.y += moveY;
              b2.x -= moveX;
              b2.y -= moveY;
            }
          }
        }
      }
      
      positions = updatedPositions;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Si no hay protectoras, no mostrar el componente de burbujas
  if (!isLoading && shelters.length === 0) {
    return null;
  }

  return (
    <div className="floating-shelters-container" ref={containerRef}>
      {shelters.map((shelter, index) => {
        // Obtener tamaño
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[index % sizes.length];
        
        return (
          <Link 
            to={`/shelters/${shelter.handle}`} 
            key={shelter._id} 
            className={`shelter-bubble ${size}`}
            ref={el => bubblesRef.current[index] = el}
            style={{ 
              position: 'absolute' // Posición absoluta controlada por JS
            }}
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
        );
      })}
    </div>
  );
};

export default LandingBubbles;
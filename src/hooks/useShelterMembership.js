// src/hooks/useShelterMembership.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import shelterService from '../services/shelter.service';
import { toast } from 'react-toastify';

export function useShelterMembership(shelter, onUpdateCallback) {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  // Verificar si el usuario actual es miembro o administrador
  const isAdmin = user && shelter?.admins?.some(admin => 
    typeof admin === 'object' ? admin._id === user._id : admin === user._id
  );
  
  const isVolunteer = user && shelter?.volunteers?.some(volunteer => 
    typeof volunteer === 'object' ? volunteer._id === user._id : volunteer === user._id
  );

  const handleJoin = async () => {
    if (!isLoggedIn || !shelter) return;
    
    setIsJoining(true);
    
    try {
      await shelterService.joinShelter(shelter._id);
      
      // Notificación de éxito
      toast.success(`Te has unido a ${shelter.name}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      // Llamar a la función para actualizar
      if (onUpdateCallback) onUpdateCallback();
    } catch (error) {
      console.error("Error al unirse a la protectora:", error);
      toast.error(error.response?.data?.message || "No se pudo unir a la protectora", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!isLoggedIn || !shelter) return;
    
    // Si el usuario es administrador, mostrar mensaje de confirmación
    if (isAdmin) {
      // Utilizamos toastify para mostrar una notificación con botones
      toast.warn(
        <div>
          Tienes funciones de administrador, ¿seguro que quieres abandonar la protectora?
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            gap: '10px'
          }}>
            <button 
              onClick={() => confirmLeave()} 
              style={{
                backgroundColor: '#ff4757',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Confirmar
            </button>
            <button 
              onClick={() => toast.dismiss()} 
              style={{
                backgroundColor: '#f1f2f6',
                color: '#333',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
        }
      );
      return;
    }
    
    // Si no es admin, proceder directamente con el abandono
    performLeave();
  };
  
  const confirmLeave = () => {
    toast.dismiss();
    performLeave();
  };
  
  const performLeave = async () => {
    setIsLeaving(true);
    
    try {
      await shelterService.leaveShelter(shelter._id);
      
      // Notificación de éxito
      toast.info(`Has abandonado ${shelter.name}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      // Llamar a la función para actualizar
      if (onUpdateCallback) onUpdateCallback();
    } catch (error) {
      console.error("Error al abandonar la protectora:", error);
      toast.error(error.response?.data?.message || "No se pudo abandonar la protectora", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return {
    isAdmin,
    isVolunteer,
    isJoining,
    isLeaving,
    handleJoin,
    handleLeave
  };
}
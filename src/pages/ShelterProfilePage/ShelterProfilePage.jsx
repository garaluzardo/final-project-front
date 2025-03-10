// ShelterPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
import './ShelterProfilePage.css';

// Importamos los componentes para las diferentes pestañas
import Taskboard from '../../components/Taskboard/Taskboard';
import AdminsList from '../../components/AdminsList/AdminsList';
import VolunteersList from '../../components/VolunteersList/VolunteerList';
import AnimalsList from '../../components/AnimalsList/AnimalsList';

function ShelterProfilePage() {
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { shelterHandle } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5005";
  
  useEffect(() => {
    // Obtener los datos de la protectora
    axios
      .get(`${API_URL}/api/shelters/handle/${shelterHandle}`)
      .then((response) => {
        setShelter(response.data);
        
        // Verificar si el usuario actual es admin o miembro
        if (user) {
          const isUserAdmin = response.data.admins.some(admin => admin._id === user._id);
          const isUserMember = response.data.volunteers.some(volunteer => volunteer._id === user._id);
          setIsAdmin(isUserAdmin);
          setIsMember(isUserMember || isUserAdmin); // Los admins también son miembros
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shelter:", error);
        setError("No se pudo encontrar la protectora solicitada");
        setLoading(false);
      });
  }, [shelterHandle, API_URL, user]);

  // Determinar la pestaña activa basada en la URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/admins')) return 'admins';
    if (path.includes('/voluntarios')) return 'voluntarios';
    if (path.includes('/animales')) return 'animales';
    return 'tareas'; // por defecto
  };

  const activeTab = getActiveTab();

  // Función para unirse/abandonar la protectora
  const handleJoinLeave = () => {
    const endpoint = isMember 
      ? `${API_URL}/api/shelters/${shelter._id}/leave` 
      : `${API_URL}/api/shelters/${shelter._id}/join`;
    
    axios
      .post(endpoint)
      .then((response) => {
        // Actualizar el estado local
        setShelter(response.data);
        setIsMember(!isMember);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (loading) {
    return (
      <div className="shelter-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información de la protectora...</p>
      </div>
    );
  }

  if (error) {
    return <div className="shelter-error">{error}</div>;
  }

  return (
    <div className="shelter-page">
      <div className="shelter-container">
        {/* Sección 1: Información y estadísticas */}
        <div className="shelter-info-section">
          <div className="shelter-header">
            <div className="shelter-avatar">
              {shelter.imageUrl ? (
                <img src={shelter.imageUrl} alt={`${shelter.name}`} />
              ) : (
                <div className="default-shelter-avatar">
                  {shelter.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="shelter-details">
              <div className="shelter-title-actions">
                <div>
                  <h1>{shelter.name}</h1>
                  <p className="shelter-handle">@{shelter.handle}</p>
                </div>
                
                {user && (
                  <div className="shelter-actions">
                    {isAdmin ? (
                      <Link to={`/shelters/${shelter.handle}/edit`} className="edit-button">
                        Editar protectora
                      </Link>
                    ) : (
                      <button 
                        onClick={handleJoinLeave} 
                        className={`join-button ${isMember ? 'leave' : 'join'}`}
                      >
                        {isMember ? 'Abandonar' : 'Unirse'}
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <p className="shelter-bio">{shelter.bio}</p>
              <p className="shelter-creation-date">
                Fundada: {new Date(shelter.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="shelter-stats">
            <Link 
              to={`/shelters/${shelter.handle}/admins`} 
              className={`stat-box ${activeTab === 'admins' ? 'active' : ''}`}
            >
              <span className="stat-number">{shelter.admins?.length || 0}</span>
              <span className="stat-label">Admins</span>
            </Link>
            
            <Link 
              to={`/shelters/${shelter.handle}/voluntarios`} 
              className={`stat-box ${activeTab === 'voluntarios' ? 'active' : ''}`}
            >
              <span className="stat-number">{shelter.volunteers?.length || 0}</span>
              <span className="stat-label">Voluntarios</span>
            </Link>
            
            <Link 
              to={`/shelters/${shelter.handle}/animales`} 
              className={`stat-box ${activeTab === 'animales' ? 'active' : ''}`}
            >
              <span className="stat-number">{shelter.animals?.length || 0}</span>
              <span className="stat-label">Mascotas</span>
            </Link>
            
            <Link 
              to={`/shelters/${shelter.handle}`} 
              className={`stat-box ${activeTab === 'tareas' ? 'active' : ''}`}
            >
              <span className="stat-number">{shelter.tasks?.length || 0}</span>
              <span className="stat-label">Tareas</span>
            </Link>
          </div>
        </div>

        {/* Sección 2: Pestañas con contenido */}
        <div className="shelter-content-section">
          <Routes>
            <Route 
              path="/" 
              element={
                <Taskboard 
                  shelterId={shelter._id} 
                  isAdmin={isAdmin} 
                  isMember={isMember}
                  userId={user?._id}
                />
              } 
            />
            <Route path="/admins" element={<AdminsList shelter={shelter} />} />
            <Route path="/voluntarios" element={<VolunteersList shelter={shelter} />} />
            <Route path="/animales" element={<AnimalsList shelter={shelter} isAdmin={isAdmin} />} />
            <Route path="*" element={<Navigate to={`/protectoras/${shelter.handle}`} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default ShelterProfilePage;
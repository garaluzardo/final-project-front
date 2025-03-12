import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import shelterService from '../../services/shelter.service';
import './ShelterProfilePage.css';

// Componentes que serán implementados más adelante
import Taskboard from '../../components/Taskboard/Taskboard';
import AnimalsList from '../../components/AnimalsList/AnimalsList';

// Componente Toast para notificaciones
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
};

// Componente para la lista de voluntarios
const VolunteersList = ({ shelter, isAdmin, onAdminChange }) => {
  // Combinamos admins y voluntarios para la lista completa
  const allVolunteers = [
    ...shelter.admins.map(admin => ({ ...admin, isAdmin: true })),
    ...shelter.volunteers.filter(vol => 
      !shelter.admins.some(admin => admin._id === vol._id)
    ).map(vol => ({ ...vol, isAdmin: false }))
  ];

  return (
    <div className="volunteers-list">
      <h2>Voluntarios ({allVolunteers.length})</h2>
      
      {allVolunteers.length === 0 ? (
        <p className="empty-message">Esta protectora aún no tiene voluntarios.</p>
      ) : (
        <div className="volunteers-grid">
          {allVolunteers.map((volunteer) => (
            <div key={volunteer._id} className="volunteer-card">
              <Link to={`/${volunteer.handle}`} className="volunteer-info">
                <div className="volunteer-avatar">
                  {volunteer.profilePicture ? (
                    <img src={volunteer.profilePicture} alt={`${volunteer.name || volunteer.handle}`} />
                  ) : (
                    <div className="default-avatar">
                      {volunteer.name ? volunteer.name.charAt(0).toUpperCase() : 
                       volunteer.handle ? volunteer.handle.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="volunteer-details">
                  <p className="volunteer-name">{volunteer.name || `@${volunteer.handle}`}</p>
                  <p className="volunteer-handle">@{volunteer.handle}</p>
                </div>
              </Link>
              
              {isAdmin && volunteer._id !== shelter.admins[0]._id && (
                <button 
                  className={`admin-toggle-button ${volunteer.isAdmin ? 'remove' : 'add'}`}
                  onClick={() => onAdminChange(volunteer._id, volunteer.isAdmin)}
                >
                  {volunteer.isAdmin ? 'Quitar admin' : 'Hacer admin'}
                </button>
              )}
              
              {volunteer.isAdmin && (
                <span className="admin-badge">Admin</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente principal
function ShelterProfilePage() {
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [toast, setToast] = useState(null);
  const [showManageAdmins, setShowManageAdmins] = useState(false);
  
  const { shelterHandle } = useParams();
  const { user } = useContext(AuthContext);
  
  // Efectos para cargar datos
  useEffect(() => {
    const fetchShelterData = async () => {
      try {
        const response = await shelterService.getShelterByHandle(shelterHandle);
        setShelter(response.data);
        
        // Verificar si el usuario actual es admin o miembro
        if (user) {
          const isUserAdmin = response.data.admins.some(admin => admin._id === user._id);
          const isUserMember = response.data.volunteers.some(volunteer => volunteer._id === user._id);
          setIsAdmin(isUserAdmin);
          setIsMember(isUserMember || isUserAdmin); // Los admins también son miembros
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shelter:", error);
        setError("No se pudo encontrar la protectora solicitada");
        setLoading(false);
      }
    };

    if (shelterHandle) {
      fetchShelterData();
    }
  }, [shelterHandle, user]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `Se unió en ${months[date.getMonth()]} del ${date.getFullYear()}`;
  };
  
  // Formatear ubicación
  const formatLocation = (location) => {
    if (!location) return null;
    
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.municipality) parts.push(location.municipality);
    if (location.province) parts.push(location.province);
    if (location.island) parts.push(location.island);
    
    return parts.length > 0 ? parts.join(', ') : null;
  };
  
  // Formatear lista de administradores
  const formatAdminsList = (admins) => {
    if (!admins || admins.length === 0) return null;
    
    if (admins.length === 1) {
      return (
        <Link to={`/${admins[0].handle}`}>
          @{admins[0].handle}
        </Link>
      );
    }
    
    if (admins.length === 2) {
      return (
        <>
          <Link to={`/${admins[0].handle}`}>@{admins[0].handle}</Link> y{' '}
          <Link to={`/${admins[1].handle}`}>@{admins[1].handle}</Link>
        </>
      );
    }
    
    const lastAdmin = admins[admins.length - 1];
    const otherAdmins = admins.slice(0, admins.length - 1);
    
    return (
      <>
        {otherAdmins.map((admin, index) => (
          <React.Fragment key={admin._id}>
            <Link to={`/${admin.handle}`}>@{admin.handle}</Link>
            {index < otherAdmins.length - 1 ? ', ' : ' '}
          </React.Fragment>
        ))}
        y <Link to={`/${lastAdmin.handle}`}>@{lastAdmin.handle}</Link>
      </>
    );
  };
  
  // Manejar unirse/abandonar la protectora
  const handleJoinLeave = async () => {
    try {
      if (isMember) {
        // Comprobar si el usuario es el último administrador
        if (isAdmin && shelter.admins.length === 1) {
          setToast({
            message: "No puedes abandonar la protectora ya que eres el único administrador. Designa a otro administrador primero.",
            type: "error"
          });
          return;
        }
        
        const response = await shelterService.leaveShelter(shelter._id);
        setShelter(response.data);
        setIsMember(false);
        setIsAdmin(false);
        
        setToast({
          message: "Has abandonado la protectora exitosamente.",
          type: "success"
        });
      } else {
        const response = await shelterService.joinShelter(shelter._id);
        setShelter(response.data);
        setIsMember(true);
        
        setToast({
          message: "Te has unido a la protectora exitosamente.",
          type: "success"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message: "Ocurrió un error. Por favor, inténtalo de nuevo.",
        type: "error"
      });
    }
  };
  
  // Manejar cambios de administrador
  const handleAdminChange = async (userId, isCurrentlyAdmin) => {
    try {
      if (isCurrentlyAdmin) {
        // Asegurarse de que no sea el último administrador
        if (shelter.admins.length <= 1) {
          setToast({
            message: "No se puede quitar el último administrador.",
            type: "error"
          });
          return;
        }
        
        const response = await shelterService.removeAdmin(shelter._id, userId);
        setShelter(response.data);
        
        setToast({
          message: "Administrador removido exitosamente.",
          type: "success"
        });
      } else {
        const response = await shelterService.addAdmin(shelter._id, userId);
        setShelter(response.data);
        
        setToast({
          message: "Administrador añadido exitosamente.",
          type: "success"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message: "Ocurrió un error al cambiar el estado de administrador.",
        type: "error"
      });
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="shelter-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información de la protectora...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="shelter-error">
        <h2>{error}</h2>
        <p>No se pudo encontrar la protectora solicitada.</p>
        <Link to="/shelters" className="button primary">
          Explorar otras protectoras
        </Link>
      </div>
    );
  }
  
  return (
    <div className="shelter-profile-container">
      {/* Toast para notificaciones */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Overlay para imagen de perfil ampliada */}
      {showProfileImage && (
        <div 
          className="profile-image-overlay"
          onClick={() => setShowProfileImage(false)}
        >
          <div className="profile-image-large">
            {shelter.imageUrl ? (
              <img src={shelter.imageUrl} alt={shelter.name} />
            ) : (
              <div className="default-avatar-large">
                {shelter.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay para gestión de administradores */}
      {showManageAdmins && (
        <div 
          className="admins-overlay"
          onClick={(e) => {
            if (e.target.className === 'admins-overlay') {
              setShowManageAdmins(false);
            }
          }}
        >
          <div className="admins-modal">
            <button 
              className="close-modal"
              onClick={() => setShowManageAdmins(false)}
            >
              ×
            </button>
            <h2>Gestionar administradores</h2>
            <VolunteersList 
              shelter={shelter} 
              isAdmin={isAdmin} 
              onAdminChange={handleAdminChange} 
            />
          </div>
        </div>
      )}
      
      <div className="shelter-profile-content">
        {/* Sección 1: Cabecera */}
        <div className="shelter-header">
          <div className="header-top">
            <div 
              className="shelter-avatar"
              onClick={() => setShowProfileImage(true)}
            >
              {shelter.imageUrl ? (
                <img src={shelter.imageUrl} alt={shelter.name} />
              ) : (
                <div className="default-avatar">
                  {shelter.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="header-actions">
              {isAdmin && (
                <>
                  <Link to={`/shelters/${shelter.handle}/edit`} className="action-button edit">
                    Editar perfil
                  </Link>
                  <button 
                    className="action-button manage"
                    onClick={() => setShowManageAdmins(true)}
                  >
                    Administración
                  </button>
                </>
              )}
              
              {user && (
                <button 
                  className={`action-button ${isMember ? 'leave' : 'join'}`}
                  onClick={handleJoinLeave}
                >
                  {isMember ? 'Abandonar' : 'Unirse'}
                </button>
              )}
            </div>
          </div>
          
          <div className="shelter-info">
            {shelter.name && <h1 className="shelter-name">{shelter.name}</h1>}
            <p className="shelter-handle">@{shelter.handle}</p>
            
            {shelter.bio && (
              <p className="shelter-bio">{shelter.bio}</p>
            )}
            
            {formatLocation(shelter.location) && (
              <p className="shelter-location">
                <span role="img" aria-label="location">📍</span> {formatLocation(shelter.location)}
              </p>
            )}
            
            <p className="shelter-admins">
              <span role="img" aria-label="admins">👥</span> Administrada por: {formatAdminsList(shelter.admins)}
            </p>
            
            <p className="shelter-joined">
              <span role="img" aria-label="calendar">📅</span> {formatDate(shelter.createdAt)}
            </p>
            
            {/* Información de contacto */}
            {(shelter.contact?.email || shelter.contact?.phone || shelter.contact?.website) && (
              <div className="shelter-contact">
                <h3>Contacto</h3>
                
                {shelter.contact?.email && (
                  <p className="contact-email">
                    <span role="img" aria-label="email">✉️</span> 
                    <a href={`mailto:${shelter.contact.email}`}>{shelter.contact.email}</a>
                  </p>
                )}
                
                {shelter.contact?.phone && (
                  <p className="contact-phone">
                    <span role="img" aria-label="phone">📞</span> 
                    <a href={`tel:${shelter.contact.phone}`}>{shelter.contact.phone}</a>
                  </p>
                )}
                
                {shelter.contact?.website && (
                  <p className="contact-website">
                    <span role="img" aria-label="website">🔗</span> 
                    <a href={shelter.contact.website} target="_blank" rel="noopener noreferrer">
                      {shelter.contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Sección 2: Pestañas y contenido */}
        <div className="shelter-tabs-container">
          <div className="shelter-tabs">
            <button 
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tablón de tareas
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'volunteers' ? 'active' : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              Voluntarios <span className="tab-count">
                {(shelter.admins.length + shelter.volunteers.length)}
              </span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'animals' ? 'active' : ''}`}
              onClick={() => setActiveTab('animals')}
            >
              Animales <span className="tab-count">{shelter.animals.length}</span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              Avisos
            </button>
          </div>
          
          <div className="shelter-tab-content">
            {/* Contenido de Tablón de tareas */}
            {activeTab === 'tasks' && (
              <Taskboard 
                shelterId={shelter._id} 
                isAdmin={isAdmin} 
                isMember={isMember}
                userId={user?._id}
              />
            )}
            
            {/* Contenido de Voluntarios */}
            {activeTab === 'volunteers' && (
              <VolunteersList 
                shelter={shelter} 
                isAdmin={isAdmin} 
                onAdminChange={handleAdminChange} 
              />
            )}
            
            {/* Contenido de Animales */}
            {activeTab === 'animals' && (
              <AnimalsList 
                shelter={shelter} 
                isAdmin={isAdmin} 
              />
            )}
            
            {/* Contenido de Avisos */}
            {activeTab === 'notices' && (
              <div className="notices-placeholder">
                <p>Esta funcionalidad estará disponible próximamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShelterProfilePage;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useParams, Link, Navigate } from "react-router-dom";
import userService from "../../services/user.service";
import "./ProfilePage.css";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
// Importar el nuevo componente CompletedTasks
import CompletedTasks from "./components/CompletedTasks/CompletedTasks";

function ProfilePage() {
  const { userHandle } = useParams(); // Obtener el handle de la URL si existe
  const { isLoggedIn, user } = useContext(AuthContext);
  
  const [profile, setProfile] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [joinedShelters, setJoinedShelters] = useState([]);
  const [ownedShelters, setOwnedShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks", "adminShelters", "memberShelters"
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    // Si no está autenticado, no hacer nada (la redirección se maneja abajo)
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    // Determinar si estamos viendo nuestro propio perfil
    let targetHandle = userHandle;

    // Si no hay handle en la URL o si el handle coincide con el del usuario actual
    if (!targetHandle || (user && targetHandle === user.handle)) {
      targetHandle = user.handle;
      setIsOwnProfile(true);
    }

    // Buscar el perfil por handle
    userService.getUserByHandle(targetHandle)
      .then((response) => {
        setProfile(response.data);
        
        // Ahora que tenemos el ID, podemos cargar el resto de datos
        const userId = response.data._id;
        
        // Cargar tareas completadas
        userService.getCompletedTasks(userId)
          .then((response) => {
            console.log("Tareas completadas obtenidas:", response.data);
            setCompletedTasks(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });

        // Cargar protectoras a las que pertenece
        userService.getJoinedShelters(userId)
          .then((response) => {
            setJoinedShelters(response.data);
          })
          .catch((error) => {
            console.error("Error fetching joined shelters:", error);
          });

        // Cargar protectoras que administra
        userService.getOwnedShelters(userId)
          .then((response) => {
            setOwnedShelters(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching owned shelters:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setError("Usuario no encontrado");
        setIsLoading(false);
      });
  }, [isLoggedIn, user, userHandle]);

  // Función para formatear la fecha de creación
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `Se unió en ${months[date.getMonth()]} del ${date.getFullYear()}`;
  };

  // Función para formatear la ubicación del usuario
  const formatLocation = (location) => {
    if (!location) return null;
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.municipality) parts.push(location.municipality);
    if (location.province) parts.push(location.province);
    if (location.island) parts.push(location.island);
    
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // Manejar la actualización del perfil después de editar
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // Si no está autenticado, redirigir a login
  if (!isLoggedIn) {
    return <Navigate to="/access" />;
  }

  // Si no hay handle en la URL, redirigir a la URL con el handle del usuario
  if (isLoggedIn && user && !userHandle) {
    return <Navigate to={`/${user.handle}`} />;
  }

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <p>No se pudo encontrar el perfil solicitado.</p>
        <Link to="/home" className="btn-home">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Overlay para imagen de perfil ampliada */}
      {showProfileImage && (
        <div 
          className="profile-image-overlay"
          onClick={() => setShowProfileImage(false)}
        >
          <div className="profile-image-large">
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt={`${profile.name}'s avatar`} />
            ) : (
              <div className="default-avatar-large">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 
                 profile?.handle ? profile.handle.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay para formulario de edición */}
      {showEditForm && (
        <EditProfileForm
          profile={profile}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
      
      <div className="profile-content">
        {/* Sección 1: Cabecera */}
        <div className="profile-header">
          <div className="header-top">
            <div 
              className="profile-avatar"
              onClick={() => setShowProfileImage(true)}
            >
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt={`${profile.name}'s avatar`} />
              ) : (
                <div className="default-avatar">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 
                   profile?.handle ? profile.handle.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            
            {/* Botón de editar perfil */}
            {isOwnProfile && (
              <button 
                className="edit-profile-button"
                onClick={() => setShowEditForm(true)}
              >
                Editar perfil
              </button>
            )}
          </div>
          
          {/* Datos del usuario */}
          <div className="profile-info">
            {profile?.name && <h1 className="profile-name">{profile.name}</h1>}
            <p className="profile-handle">@{profile?.handle}</p>
            
            {profile?.bio && (
              <p className="profile-bio">{profile.bio}</p>
            )}
            
            {/* Mostrar ubicación si existe */}
            {formatLocation(profile?.location) && (
              <p className="profile-location">
                <span role="img" aria-label="location">📍</span> {formatLocation(profile.location)}
              </p>
            )}
            
            {/* Fecha de ingreso */}
            <p className="profile-joined">
              <span role="img" aria-label="calendar">📅</span> {formatJoinDate(profile?.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Sección 2: Pestañas y contenido */}
        <div className="profile-tabs-container">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tareas realizadas <span className="tab-count">{completedTasks.length}</span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === "adminShelters" ? "active" : ""}`}
              onClick={() => setActiveTab("adminShelters")}
            >
              Administra <span className="tab-count">{ownedShelters.length}</span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === "memberShelters" ? "active" : ""}`}
              onClick={() => setActiveTab("memberShelters")}
            >
              Ayuda en <span className="tab-count">{joinedShelters.length}</span>
            </button>
          </div>
          
          <div className="profile-tab-content">
            {/* Contenido Tab: Tareas - MODIFICADO PARA USAR EL COMPONENTE */}
            {activeTab === "tasks" && (
              <div className="tasks-content">
                <CompletedTasks 
                  completedTasks={completedTasks}
                  isOwnProfile={isOwnProfile}
                  profile={profile}
                />
              </div>
            )}
            
            {/* Contenido Tab: Protectoras que administra */}
            {activeTab === "adminShelters" && (
              <div className="shelters-content">
                {ownedShelters.length === 0 ? (
                  <div className="empty-content">
                    <p>
                      {isOwnProfile 
                        ? "Aún no administras ninguna protectora." 
                        : `${profile?.name || profile?.handle} aún no administra ninguna protectora.`}
                    </p>
                    {isOwnProfile && (
                      <Link to="/create-shelter" className="create-button">
                        Crear una protectora
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="shelters-grid">
                    {ownedShelters.map((shelter) => (
                      <Link 
                        to={`/shelters/${shelter.handle}`} 
                        key={shelter._id} 
                        className="shelter-card"
                      >
                        <div className="shelter-image">
                          {shelter.imageUrl ? (
                            <img src={shelter.imageUrl} alt={shelter.name} />
                          ) : (
                            <div className="default-shelter-image">
                              {shelter.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="shelter-card-content">
                          <h3 className="shelter-title">{shelter.name}</h3>
                          
                          {/* Usar el nuevo formato de ubicación */}
                          {formatLocation(shelter.location) && (
                            <p className="shelter-location">{formatLocation(shelter.location)}</p>
                          )}
                          
                          <p className="shelter-description">{shelter.bio || shelter.description}</p>
                          <div className="shelter-stats">
                            <span>{shelter.volunteers?.length || shelter.members?.length || 0} miembros</span>
                            <span>{shelter.animals?.length || 0} animales</span>
                          </div>
                          <div className="admin-badge">Administrador</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Contenido Tab: Protectoras en las que ayuda */}
            {activeTab === "memberShelters" && (
              <div className="shelters-content">
                {joinedShelters.length === 0 ? (
                  <div className="empty-content">
                    <p>
                      {isOwnProfile 
                        ? "Aún no perteneces a ninguna protectora como voluntario." 
                        : `${profile?.name || profile?.handle} aún no pertenece a ninguna protectora como voluntario.`}
                    </p>
                    {isOwnProfile && (
                      <Link to="/shelters" className="explore-button">
                        Explorar protectoras
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="shelters-grid">
                    {joinedShelters.map((shelter) => (
                      <Link 
                        to={`/shelters/${shelter.handle}`} 
                        key={shelter._id} 
                        className="shelter-card"
                      >
                        <div className="shelter-image">
                          {shelter.imageUrl ? (
                            <img src={shelter.imageUrl} alt={shelter.name} />
                          ) : (
                            <div className="default-shelter-image">
                              {shelter.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="shelter-card-content">
                          <h3 className="shelter-title">{shelter.name}</h3>
                          
                          {/* Usar el nuevo formato de ubicación */}
                          {formatLocation(shelter.location) && (
                            <p className="shelter-location">{formatLocation(shelter.location)}</p>
                          )}
                          
                          <p className="shelter-description">{shelter.bio || shelter.description}</p>
                          <div className="shelter-stats">
                            <span>{shelter.volunteers?.length || shelter.members?.length || 0} miembros</span>
                            <span>{shelter.animals?.length || 0} animales</span>
                          </div>
                          <div className="member-badge">Voluntario</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
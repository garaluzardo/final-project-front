import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

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

  const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5005";

  useEffect(() => {
    // Si no está autenticado, no hacer nada (la redirección se maneja abajo)
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    // Determinar si estamos viendo nuestro propio perfil
    let targetHandle = userHandle;
    let isViewingSelf = false;

    // Si no hay handle en la URL o si el handle coincide con el del usuario actual
    if (!targetHandle || (user && targetHandle === user.handle)) {
      targetHandle = user.handle;
      isViewingSelf = true;
      setIsOwnProfile(true);
    }

    // Buscar el perfil por handle
    axios
      .get(`${API_URL}/api/users/handle/${targetHandle}`)
      .then((response) => {
        setProfile(response.data);
        
        // Ahora que tenemos el ID, podemos cargar el resto de datos
        const userId = response.data._id;
        
        // Cargar tareas completadas
        axios
          .get(`${API_URL}/api/users/${userId}/completed-tasks`)
          .then((response) => {
            setCompletedTasks(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });

        // Cargar protectoras a las que pertenece
        axios
          .get(`${API_URL}/api/users/${userId}/joined-shelters`)
          .then((response) => {
            setJoinedShelters(response.data);
          })
          .catch((error) => {
            console.error("Error fetching joined shelters:", error);
          });

        // Cargar protectoras que administra
        axios
          .get(`${API_URL}/api/users/${userId}/owned-shelters`)
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
  }, [isLoggedIn, user, userHandle, API_URL]);

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
        <Link to="/" className="btn-home">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile?.profilePicture ? (
            <img src={profile.profilePicture} alt={`${profile.name}'s avatar`} />
          ) : (
            <div className="default-avatar">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 
               profile?.handle ? profile.handle.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="profile-info">
          {/* Título y botones de acción */}
          <div className="profile-title-actions">
            <div>
              <h1>{profile?.name || `@${profile?.handle}`}</h1>
              <p className="profile-handle">@{profile?.handle}</p>
            </div>
            
            {/* Mostrar botón de editar perfil solo si es mi perfil */}
            {isOwnProfile && (
              <Link to="/profile/edit" className="edit-profile-button">
                Editar Perfil
              </Link>
            )}
          </div>
          
          <p className="profile-bio">
            {profile?.bio || "Este usuario aún no ha añadido una biografía."}
          </p>
          
          {profile?.location && (
            <p className="profile-location">
              <span role="img" aria-label="location">📍</span> {profile.location}
            </p>
          )}
          
          <p className="profile-joined">
            <span role="img" aria-label="calendar">📅</span> Se unió el {new Date(profile?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sección estadísticas */}
      <div className="profile-stats">
        <div className="stat-box">
          <span className="stat-number">{completedTasks.length}</span>
          <span className="stat-label">Tareas completadas</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{joinedShelters.length}</span>
          <span className="stat-label">Protectoras</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{ownedShelters.length}</span>
          <span className="stat-label">Administrando</span>
        </div>
      </div>

      {/* Sección de protectoras que administra */}
      <div className="section-container">
        <h2>
          {isOwnProfile 
            ? "Protectoras que administras" 
            : `Protectoras que administra ${profile?.name || profile?.handle}`}
        </h2>
        {ownedShelters.length === 0 ? (
          <div className="empty-state">
            <p>
              {isOwnProfile 
                ? "Aún no administras ninguna protectora." 
                : "Este usuario aún no administra ninguna protectora."}
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
                <h3>{shelter.name}</h3>
                <p className="shelter-location">{shelter.location}</p>
                <p className="shelter-description">{shelter.bio || shelter.description}</p>
                <div className="shelter-stats">
                  <span>{shelter.volunteers?.length || shelter.members?.length || 0} miembros</span>
                  <span>{shelter.animals?.length || 0} animales</span>
                </div>
                <div className="admin-badge">Administrador</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sección de protectoras a las que pertenece */}
      <div className="section-container">
        <h2>
          {isOwnProfile 
            ? "Protectoras a las que perteneces" 
            : `Protectoras a las que pertenece ${profile?.name || profile?.handle}`}
        </h2>
        {joinedShelters.length === 0 ? (
          <div className="empty-state">
            <p>
              {isOwnProfile 
                ? "Aún no perteneces a ninguna protectora." 
                : "Este usuario aún no pertenece a ninguna protectora."}
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
                <h3>{shelter.name}</h3>
                <p className="shelter-location">{shelter.location}</p>
                <p className="shelter-description">{shelter.bio || shelter.description}</p>
                <div className="shelter-stats">
                  <span>{shelter.volunteers?.length || shelter.members?.length || 0} miembros</span>
                  <span>{shelter.animals?.length || 0} animales</span>
                </div>
                <div className="member-badge">Miembro</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sección de tareas completadas */}
      <div className="section-container">
        <h2>
          {isOwnProfile 
            ? "Tareas completadas" 
            : `Tareas completadas por ${profile?.name || profile?.handle}`}
        </h2>
        {completedTasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {isOwnProfile 
                ? "Aún no has completado ninguna tarea." 
                : "Este usuario aún no ha completado ninguna tarea."}
            </p>
          </div>
        ) : (
          <div className="tasks-grid">
            {completedTasks.map((task) => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className="task-date">
                    {new Date(task.completedAt).toLocaleDateString()}
                  </span>
                  <span className="task-shelter">{task.shelter?.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
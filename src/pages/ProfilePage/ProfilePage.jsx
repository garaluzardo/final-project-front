import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

function ProfilePage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [joinedShelters, setJoinedShelters] = useState([]);
  const [ownedShelters, setOwnedShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5005";

  useEffect(() => {
    if (isLoggedIn && user) {
      // Fetch user profile information
      axios
        .get(`${API_URL}/api/users/${user._id}`)
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });

      // Fetch completed tasks
      axios
        .get(`${API_URL}/api/users/${user._id}/tasks`)
        .then((response) => {
          setCompletedTasks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });

      // Fetch shelters the user has joined
      axios
        .get(`${API_URL}/api/users/${user._id}/joined-shelters`)
        .then((response) => {
          setJoinedShelters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching joined shelters:", error);
        });

      // Fetch shelters the user owns/administers
      axios
        .get(`${API_URL}/api/users/${user._id}/owned-shelters`)
        .then((response) => {
          setOwnedShelters(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching owned shelters:", error);
          setIsLoading(false);
        });
    }
  }, [isLoggedIn, user, API_URL]);

  // Redirect if user is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/access" />;
  }

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile?.imageUrl ? (
            <img src={profile.imageUrl} alt={`${profile.name}'s avatar`} />
          ) : (
            <div className="default-avatar">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="profile-info">
          <h1>{profile?.name || user?.name}</h1>
          <p className="profile-email">{profile?.email || user?.email}</p>
          <p className="profile-bio">
            {profile?.bio || "Este usuario aún no ha añadido una biografía."}
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
        <div className="stat-box">
          <span className="stat-number">{profile?.joined?.split("T")[0] || "N/A"}</span>
          <span className="stat-label">Miembro desde</span>
        </div>
      </div>

      {/* Sección de protectoras que administra */}
      <div className="section-container">
        <h2>Protectoras que administras</h2>
        {ownedShelters.length === 0 ? (
          <div className="empty-state">
            <p>Aún no administras ninguna protectora.</p>
            <Link to="/shelters/create" className="create-button">
              Crear una protectora
            </Link>
          </div>
        ) : (
          <div className="shelters-grid">
            {ownedShelters.map((shelter) => (
              <Link 
                to={`/shelters/${shelter._id}`} 
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
                <p className="shelter-description">{shelter.description}</p>
                <div className="shelter-stats">
                  <span>{shelter.members?.length || 0} miembros</span>
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
        <h2>Protectoras a las que perteneces</h2>
        {joinedShelters.length === 0 ? (
          <div className="empty-state">
            <p>Aún no perteneces a ninguna protectora.</p>
            <Link to="/shelters" className="explore-button">
              Explorar protectoras
            </Link>
          </div>
        ) : (
          <div className="shelters-grid">
            {joinedShelters.map((shelter) => (
              <Link 
                to={`/shelters/${shelter._id}`} 
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
                <p className="shelter-description">{shelter.description}</p>
                <div className="shelter-stats">
                  <span>{shelter.members?.length || 0} miembros</span>
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
        <h2>Tareas completadas</h2>
        {completedTasks.length === 0 ? (
          <div className="empty-state">
            <p>Aún no has completado ninguna tarea.</p>
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
                  <span className="task-shelter">{task.shelter.name}</span>
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../../../services/user.service';
import './VolunteersList.css';

const VolunteersList = ({ shelter }) => {
  const navigate = useNavigate();

  // Asegurarse de que shelter y sus propiedades existen
  const admins = shelter?.admins || [];
  const volunteers = shelter?.volunteers || [];

  const allVolunteers = [
    ...admins.map(admin => ({ ...admin, role: 'admin' })),
    ...volunteers.map(volunteer => ({ ...volunteer, role: 'volunteer' }))
  ];

  const handleVolunteerClick = (volunteer) => {
    console.log('Voluntario clickeado:', volunteer);
    
    // Verificar que el voluntario tiene un handle
    if (!volunteer.handle) {
      console.error('Handle no definido para el voluntario:', volunteer);
      return;
    }

    // Navegar directamente sin esperar la llamada API
    navigate(`/${volunteer.handle}`);
    
    // Opcionalmente, cargar datos adicionales después de la navegación
    userService.getUserByHandle(volunteer.handle)
      .then(response => {
        console.log('Datos del usuario cargados:', response.data);
        // Puedes usar estos datos para actualizar el estado global o el contexto
      })
      .catch(error => {
        console.error('Error al cargar datos del usuario:', error);
        // Manejar el error pero no afecta la navegación que ya ocurrió
      });
  };

  return (
    <div className="volunteers-list">
      <h2>Voluntarios ({allVolunteers.length})</h2>
      
      {allVolunteers.length === 0 ? (
        <p className="empty-message">Esta protectora aún no tiene voluntarios.</p>
      ) : (
        <div className="volunteers-grid">
          {allVolunteers.map((volunteer, index) => (
  <div 
    key={volunteer._id || `volunteer-${index}`} // Usar index como parte del fallback
    className="volunteer-card"
    onClick={() => handleVolunteerClick(volunteer)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleVolunteerClick(volunteer);
      }
    }}
  >
              <div className="volunteer-avatar">
                {volunteer.profilePicture ? (
                  <img 
                    src={volunteer.profilePicture || "/placeholder.svg"} 
                    alt={`${volunteer.name || volunteer.handle || 'Usuario'}`} 
                  />
                ) : (
                  <div className="default-avatar">
                    {volunteer.name ? volunteer.name.charAt(0).toUpperCase() : 
                     volunteer.handle ? volunteer.handle.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="volunteer-details">
                <p className="volunteer-name">
                  {volunteer.name || volunteer.handle || 'Usuario sin nombre'}
                </p>
                <p className="volunteer-handle">
                  {volunteer.handle ? `@${volunteer.handle}` : 'Sin handle'}
                </p>
                {volunteer.role === 'admin' && (
                  <span className="admin-badge">Admin</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteersList;
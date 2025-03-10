import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  // URL del logo (puedes reemplazarla con tu propio logo)
  const logoUrl = "./images/logo-color.png"; // Reemplaza con la ruta a tu logo

  return (
    <nav className="navbar">
      {/* Sección izquierda - Logo y nombre de la app */}
      <Link to="/" className="navbar-logo">
        {logoUrl && <img src={logoUrl} alt="PetPal Logo" />}
        <span className="navbar-logo-text">PETPAL</span>
      </Link>

      {/* Sección derecha - Navegación y perfil */}
      <div className="navbar-nav">
        {/* Este botón es visible para todos los usuarios */}
        <Link to="/shelters" className="navbar-button">
          Explorar Protectoras
        </Link>

        {isLoggedIn ? (
          /* Usuario autenticado - Mostrar foto de perfil con menú desplegable */
          <div className="navbar-profile">
            {/* Imagen de perfil clickable */}
            <Link to={`/${user?.handle || 'profile'}`}>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Perfil" 
                  className="navbar-profile-img" 
                />
              ) : (
                <div 
                  className="navbar-profile-img" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#6c5ce7',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 
                   user?.handle ? user.handle.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Link>

            {/* Menú desplegable al hacer hover */}
            <div className="navbar-profile-menu">
              <Link to={`/${user?.handle || 'profile'}`} className="navbar-profile-item">
                Mi Perfil
              </Link>
              <Link to="/create-shelter" className="navbar-profile-item">
                Crear Protectora
              </Link>
              <button 
                onClick={logOutUser} 
                className="navbar-profile-item logout"
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          /* Usuario no autenticado - Mostrar botón de acceso */
          <Link to="/access" className="navbar-button primary">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
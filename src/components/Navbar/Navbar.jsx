import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";

import LogoBN from "../../assets/images/logo-bn.png";
import LogoColor from "../../assets/images/logo-color.png";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  // Detecta el ancho de la scrollbar y lo establece como variable CSS
  useEffect(() => {
    const setScrollbarWidth = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };
    
    setScrollbarWidth();
    window.addEventListener('resize', setScrollbarWidth);
    
    return () => window.removeEventListener('resize', setScrollbarWidth);
  }, []);

  // Si el usuario no está conectado, no se muestra el navbar
  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="navbar">
      {/* Sección izquierda - Logo y nombre de la app */}
      <div className="left-section">
        <Link to="/home" className="logo-container">
          <img src={LogoBN} alt="Logo" className="logo-bn" />
          <img src={LogoColor} alt="Logo" className="logo-color" />
        </Link>
        <p className="title">
          <b>PET</b>PAL
        </p>
      </div>

      {/* Sección derecha - Navegación y perfil */}
      <div className="navbar-nav">
        {/* Este botón es visible para todos los usuarios */}
        <Link to="/shelters" className="navbar-button">
          Explorar Protectoras
        </Link>

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
      </div>
    </nav>
  );
}

export default Navbar;
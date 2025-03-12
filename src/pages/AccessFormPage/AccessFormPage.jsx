import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/auth.context";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth.service";
import './AccessFormPage.css';

const AccessFormPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="AccessFormPage">
      <video autoPlay loop muted className="background-video" src="/videos/puppies.mp4"></video>
       <Link to="/" className="title-link" style={{ textDecoration: 'none' }} >
      <h1>PET PAL</h1>
      </Link>
      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
        <div className="form-container sign-up-container">
          <Signup toggleForm={toggleForm} />
        </div>
        <div className="form-container sign-in-container">
          <Signin />
        </div>
        <div className="overlay-container">
          <Overlay toggleForm={toggleForm} />
        </div>
      </div>
    </div>
  );
};

const Signup = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleHandleChange = (e) => setHandle(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, handle };

    // Use the authService to register the user
    authService
      .signup(requestBody)
      .then((response) => {
        // Si el registro es exitoso, cambia al formulario de login
        toggleForm();
      })
      .catch((error) => {
        // Si hay un error, muestra el mensaje
        const errorDescription = error.response?.data?.message || "Error al registrar";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <form onSubmit={handleSignupSubmit}>
      <h1>Crea tu cuenta</h1>
      <input 
        type="text" 
        name="handle" 
        value={handle}
        placeholder="Usuario" 
        onChange={handleHandleChange} 
      />
      <input 
        type="email" 
        name="email" 
        value={email}
        placeholder="Email" 
        onChange={handleEmail} 
      />
      <input 
        type="password" 
        name="password" 
        value={password}
        placeholder="Contraseña" 
        onChange={handlePassword} 
      />
      <button type="submit" className="button-access">Regístrate</button>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Use the authService to login
    authService
      .login(requestBody)
      .then((response) => {
        // Store the token in the localStorage
        storeToken(response.data.authToken);
        
        // Verify the token and update state variables
        authenticateUser();
        
        // Redirect to the home page
        navigate("/home");
      })
      .catch((error) => {
        // Si hay un error, muestra el mensaje
        const errorDescription = error.response?.data?.message || "Error al iniciar sesión";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <h1>Inicia sesión</h1>
      <input 
        type="email" 
        name="email" 
        value={email}
        placeholder="Email" 
        onChange={handleEmail} 
      />
      <input 
        type="password" 
        name="password" 
        value={password}
        placeholder="Contraseña" 
        onChange={handlePassword} 
      />
      <a href="/reset-password">¿Olvidaste tu contraseña?</a>
      <button type="submit" className="button-access">Entra</button>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

const Overlay = ({ toggleForm }) => {
  return (
    <div className="overlay">
      <div className="overlay-panel overlay-left">
        <h1>¿Ya tienes una cuenta?</h1>
        <p>Inicia sesión para acceder a PetPal y disfrutar de todas las funcionalidades.</p>
        <button className="button-ghost" onClick={toggleForm}>Entra</button>
      </div>
      <div className="overlay-panel overlay-right">
        <h1>¿Aún no tienes cuenta?</h1>
        <p>Regístrate ahora y comienza una nueva experiencia.</p>
        <button className="button-ghost" onClick={toggleForm}>Regístrate</button>
      </div>
    </div>
  );
};

export default AccessFormPage;
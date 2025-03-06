import React, { useState } from 'react';
import './AccessFormPage.css';

const AccessFormPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="AccessFormPage">

<video autoPlay loop muted className="background-video" src="/videos/puppies.mp4"></video>


    <h1>PET PAL</h1>

    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <Signup />
      </div>
      <div className="form-container sign-in-container">
        <Signin />
      </div>
      <div className="overlay-container">
        <Overlay toggleForm={toggleForm} />
      </div>
    </div>
    {/* <img className="Perrito" src="/images/perrito.gif" alt="Dog gif" /> */}

    </div>
  );
};

const Signup = () => {
  return (
    <form action="">
      <h1>Crea tu cuenta</h1>
      <input type="text" placeholder="Nombre de usuario" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Contraseña" />
      <button className="button-access" >Regístrate</button>
    </form>
  );
};

const Signin = () => {
  return (
    <form action="">
      <h1>Inicia sesión</h1>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Contraseña" />
      <a href="#">¿Olvidaste tu contraseña?</a>
      <button className="button-access">Entra</button>
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

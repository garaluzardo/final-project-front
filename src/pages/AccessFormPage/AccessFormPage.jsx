import React, { useState } from 'react';
import './AccessFormPage.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
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
  );
};

const Signup = () => {
  return (
    <form action="">
      <h1>Create Account</h1>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Sign Up</button>
    </form>
  );
};

const Signin = () => {
  return (
    <form action="">
      <h1>Sign In</h1>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <a href="#">Forgot your password?</a>
      <button>Sign In</button>
    </form>
  );
};

const Overlay = ({ toggleForm }) => {
  return (
    <div className="overlay">
      <div className="overlay-panel overlay-left">
        <h1>Already have an account?</h1>
        <p>Login to access your dashboard and experience the power of the web.</p>
        <button className="ghost" onClick={toggleForm}>Sign In</button>
      </div>
      <div className="overlay-panel overlay-right">
        <h1>Don't have an account?</h1>
        <p>Create an account and let's begin a new journey</p>
        <button className="ghost" onClick={toggleForm}>Sign Up</button>
      </div>
    </div>
  );
};

export default AuthForm;

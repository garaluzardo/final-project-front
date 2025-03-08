import React, { useState } from 'react';
import axios from 'axios';

function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const requestBody = { email, password };
    console.log("Intentando login directo con:", requestBody);
    
    try {
      const response = await axios.post(
        'http://localhost:5005/auth/login',
        requestBody
      );
      console.log("Respuesta login:", response.data);
      setMessage("Login exitoso: " + JSON.stringify(response.data));
    } catch (err) {
      console.error("Error en login directo:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const name = "Test User";
    const requestBody = { email, password, name };
    console.log("Intentando signup directo con:", requestBody);
    
    try {
      const response = await axios.post(
        'http://localhost:5005/auth/signup',
        requestBody
      );
      console.log("Respuesta signup:", response.data);
      setMessage("Registro exitoso: " + JSON.stringify(response.data));
    } catch (err) {
      console.error("Error en signup directo:", err);
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Prueba de Login Directa</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Password:
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            style={{ padding: '10px 15px', marginRight: '10px', background: '#4CAF50', color: 'white', border: 'none' }}
          >
            Iniciar Sesión
          </button>
          
          <button 
            type="button" 
            onClick={handleSignup}
            style={{ padding: '10px 15px', background: '#2196F3', color: 'white', border: 'none' }}
          >
            Registrarse
          </button>
        </div>
      </form>
      
      {message && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#DFF2BF', color: '#4F8A10' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#FFD2D2', color: '#D8000C' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default TestLoginPage;
import React, { useState, useRef, useEffect } from 'react';
import aiService from '../../services/ai.service';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "¡Hola! Soy el asistente de PETPAL. ¿En qué puedo ayudarte hoy?", 
      sender: "bot" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const chatHistory = messages
        .slice(-10)
        .filter(msg => msg.sender === "user")
        .map(msg => ({
          role: "user",
          parts: [{ text: msg.text }]
        }));
      
      const response = await aiService.sendChatMessage(inputMessage, chatHistory);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response.data.response || response.data,
        sender: "bot"
      }]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      
      // Nuevos bloques de manejo de errores
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Manejo de errores de validación
        if (errorData.errors) {
          const validationErrors = errorData.errors
            .map(err => `${err.param}: ${err.message}`)
            .join('\n');
          
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Error de validación:\n${validationErrors}`,
            sender: "bot"
          }]);
        } 
        // Manejo de límite de tasa
        else if (errorData.message === "Demasiadas solicitudes, por favor intenta de nuevo más tarde.") {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Has alcanzado el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo.",
            sender: "bot"
          }]);
        }
        // Otros errores del servidor
        else {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Ocurrió un error al procesar tu mensaje.",
            sender: "bot"
          }]);
        }
      } else {
        // Error de red u otro tipo de error
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Lo siento, no se pudo enviar el mensaje. Comprueba tu conexión.",
          sender: "bot"
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Botón flotante para abrir/cerrar el chat */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </button>
      
      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>PETPAL Asistente</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputMessage.trim()}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
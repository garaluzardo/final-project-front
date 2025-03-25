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
    
    // Añadir mensaje del usuario
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
      
      // Envía el mensaje al back
      const response = await aiService.sendChatMessage(inputMessage, chatHistory);
      
      // Añade la respuesta del bot
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response.data.response || response.data,
        sender: "bot"
      }]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
        sender: "bot"
      }]);
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
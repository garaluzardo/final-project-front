import axios from "axios";

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Configuración del interceptor para añadir el token automáticamente
    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }
      return config;
    });
  }

  sendChatMessage = (message, chatHistory = []) => {
    return this.api.post('/api/ai/chat', { message, chatHistory });
  };
}

const aiService = new AIService();
export default aiService;
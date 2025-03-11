import axios from "axios";

class StatsService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });
  }

  // Obtengo las estadísticas generales (número de usuarios y protectoras)
  getGeneralStats = async () => {
    try {
      const response = await this.api.get("/api/stats/general");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      // Retorno los valores predeterminados en caso de error
      return {
        usersCount: 0,
        sheltersCount: 0
      };
    }
  };
}

// Creo una instancia del servicio
const statsService = new StatsService();

export default statsService;
import axios from "axios";

class ShelterService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      // Retrieve the JWT token from the local storage
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }

      return config;
    });
  }

  // Obtener todas las protectoras
  getAllShelters = () => {
    return this.api.get("/api/shelters");
  };

  // Obtener una protectora por ID
  getShelterById = (id) => {
    return this.api.get(`/api/shelters/${id}`);
  };

  // Obtener una protectora por handle
  getShelterByHandle = (handle) => {
    return this.api.get(`/api/shelters/handle/${handle}`);
  };

  // Crear una nueva protectora
  createShelter = (shelterData) => {
    return this.api.post("/api/shelters", shelterData);
  };

  // Actualizar una protectora existente
  updateShelter = (id, shelterData) => {
    return this.api.put(`/api/shelters/${id}`, shelterData);
  };

  // Eliminar una protectora
  deleteShelter = (id) => {
    return this.api.delete(`/api/shelters/${id}`);
  };

  // Unirse a una protectora como voluntario
  joinShelter = (id) => {
    return this.api.post(`/api/shelters/${id}/join`);
  };

  // Abandonar una protectora
  leaveShelter = (id) => {
    return this.api.post(`/api/shelters/${id}/leave`);
  };

  // Añadir un administrador a una protectora
  addAdmin = (shelterId, userId) => {
    return this.api.post(`/api/shelters/${shelterId}/admins/${userId}`);
  };

  // Quitar un administrador de una protectora
  removeAdmin = (shelterId, userId) => {
    return this.api.delete(`/api/shelters/${shelterId}/admins/${userId}`);
  };

  // Obtener las tareas de una protectora
  getShelterTasks = (id) => {
    return this.api.get(`/api/shelters/${id}/tasks`);
  };

  // Obtener los animales de una protectora
  getShelterAnimals = (id) => {
    return this.api.get(`/api/shelters/${id}/animals`);
  };

  // Obtener los administradores de una protectora
  getShelterAdmins = (id) => {
    return this.api.get(`/api/shelters/${id}/admins`);
  };

  // Obtener los voluntarios de una protectora
  getShelterVolunteers = (id) => {
    return this.api.get(`/api/shelters/${id}/volunteers`);
  };
}

// Create one instance (object) of the service
const shelterService = new ShelterService();

export default shelterService;
import axios from "axios";

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Configurar interceptor para añadir token automáticamente
    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }
      return config;
    });
  }

  // Obtener todos los usuarios
  getAllUsers = () => {
    return this.api.get("/api/users");
  };

  // Obtener usuario por handle
  getUserByHandle = (handle) => {
    return this.api.get(`/api/users/handle/${handle}`);
  };

  // Obtener usuario por ID
  getUserById = (id) => {
    return this.api.get(`/api/users/${id}`);
  };

  // Obtener tareas completadas
  getCompletedTasks = (userId) => {
    return this.api.get(`/api/users/${userId}/completed-tasks`);
  };

  // Obtener tareas creadas
  getCreatedTasks = (userId) => {
    return this.api.get(`/api/users/${userId}/created-tasks`);
  };

  // Obtener protectoras a las que pertenece
  getJoinedShelters = (userId) => {
    return this.api.get(`/api/users/${userId}/joined-shelters`);
  };

  // Obtener protectoras que administra
  getOwnedShelters = (userId) => {
    return this.api.get(`/api/users/${userId}/owned-shelters`);
  };

  // Crear usuario (aunque normalmente se usa authService.signup)
  createUser = (userData) => {
    return this.api.post("/api/users", userData);
  };

  // Actualizar perfil (PUT completo)
  updateProfile = (userId, userData) => {
    return this.api.put(`/api/users/${userId}`, userData);
  };

  // Actualizar perfil parcialmente (PATCH)
  updateProfilePartial = (userId, userData) => {
    return this.api.patch(`/api/users/${userId}`, userData);
  };

  // Actualizar contraseña
  updatePassword = (userId, passwordData) => {
    return this.api.put(`/api/users/${userId}/password`, passwordData);
  };

  // Eliminar cuenta
  deleteAccount = (userId, confirmData) => {
    return this.api.delete(`/api/users/${userId}`, { data: confirmData });
  };

  // Verificar estado de administración antes de eliminar cuenta
  checkAdminStatus = (userId) => {
    return this.api.get(`/api/users/${userId}/admin-status`);
  };

  // Para la carga de imágenes (cuando implementes Cloudinary)
  uploadProfileImage = (file) => {
    // Este método se implementará cuando conectes con Cloudinary
    const uploadData = new FormData();
    uploadData.append("file", file);
    
    // Este endpoint deberá existir en tu backend
    return this.api.post("/api/upload", uploadData);
  };
}

const userService = new UserService();
export default userService;
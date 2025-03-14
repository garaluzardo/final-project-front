import axios from "axios";

class TaskService {
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

  // Obtener todas las tareas de una protectora
  getShelterTasks = (shelterId) => {
    return this.api.get(`/api/tasks/shelter/${shelterId}`);
  };

  // Obtener una tarea específica por ID
  getTask = (taskId) => {
    return this.api.get(`/api/tasks/${taskId}`);
  };

  // Crear una nueva tarea (solo admins)
  createTask = (taskData) => {
    return this.api.post('/api/tasks', taskData);
  };

  // Actualizar una tarea existente (solo admins)
  updateTask = (taskId, taskData) => {
    return this.api.put(`/api/tasks/${taskId}`, taskData);
  };

  // Eliminar una tarea (solo admins)
  deleteTask = (taskId) => {
    return this.api.delete(`/api/tasks/${taskId}`);
  };

  // Marcar/desmarcar tarea como completada (miembros)
/*   toggleTaskCompletion = (taskId) => {
    return this.api.patch(`/api/tasks/${taskId}/toggle-complete`);
  }; */

  // Añadir un comentario a la tarea (miembros)
  addComment = (taskId, content) => {
    return this.api.post(`/api/tasks/${taskId}/comments`, { content });
  };

  // Eliminar un comentario (solo autor del comentario o admins)
  deleteComment = (taskId, commentId) => {
    return this.api.delete(`/api/tasks/${taskId}/comments/${commentId}`);
  };

  // Obtener tareas filtradas por estado (completadas o pendientes)
  getFilteredTasks = (shelterId, isCompleted) => {
    return this.api.get(`/api/tasks/shelter/${shelterId}`)
      .then((response) => {
        // Filtramos en el cliente ya que el backend no proporciona este filtro directamente
        return {
          data: response.data.filter((task) => task.completed === isCompleted)
        };
      });
  };

  // Obtener tareas por prioridad
  getTasksByPriority = (shelterId, priority) => {
    return this.api.get(`/api/tasks/shelter/${shelterId}`)
      .then((response) => {
        // Filtramos en el cliente ya que el backend no proporciona este filtro directamente
        return {
          data: response.data.filter((task) => task.priority === priority)
        };
      });
  };

  // Obtener tareas por tag/categoría
  getTasksByTag = (shelterId, tag) => {
    return this.api.get(`/api/tasks/shelter/${shelterId}`)
      .then((response) => {
        // Filtramos en el cliente ya que el backend no proporciona este filtro directamente
        return {
          data: response.data.filter((task) => task.tag === tag)
        };
      });
  };

  // Función auxiliar para traducir la prioridad y tags para la UI
  translateTaskFields = (task) => {
    // Mapeo de prioridades a español
    const priorityMap = {
      "low": "Baja",
      "medium": "Media",
      "high": "Alta"
    };

    // Mapeo de tags a español
    const tagMap = {
      "health": "Salud",
      "food": "Alimentación",
      "cleaning": "Limpieza",
      "exercise": "Ejercicio",
      "other": "Otros"
    };

    return {
      ...task,
      priorityText: priorityMap[task.priority] || task.priority,
      tagText: tagMap[task.tag] || task.tag
    };
  };

  // Obtener tareas y formatearlas para la UI
  getFormattedTasks = (shelterId) => {
    return this.getShelterTasks(shelterId)
      .then((response) => {
        const formattedTasks = response.data.map(task => 
          this.translateTaskFields(task)
        );
        return { data: formattedTasks };
      });
  };

  // Solución temporal al check de tareas por parte de miembros
  toggleTaskCompletion = (taskId) => {
    return this.api.patch(`/api/tasks/${taskId}/toggle-complete-bypass`);
  };

}

// Crear una instancia del servicio y exportarla
const taskService = new TaskService();
export default taskService;
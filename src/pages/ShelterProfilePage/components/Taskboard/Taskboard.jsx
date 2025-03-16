import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import taskService from '../../../../services/task.service';
import './Taskboard.css';

function Taskboard({ shelterId, isAdmin, isMember, userId }) {
  // Estados principales
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Estados para formularios
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    tag: 'other',
    priority: 'medium'
  });
  
  // Estado para filtros
  const [activeFilters, setActiveFilters] = useState({
    tags: [],
    status: null // null = todas, true = completadas, false = pendientes
  });
  
  // Estado para carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Si el usuario es admin, también debería ser considerado miembro (voluntario)
  const [isMemberInternal, setIsMemberInternal] = useState(isMember);
  
  useEffect(() => {
    if (isAdmin && !isMember) {
      console.log("Ajustando permisos: administrador también es miembro");
      setIsMemberInternal(true);
    } else {
      setIsMemberInternal(isMember);
    }
  }, [isAdmin, isMember]);

  // Función para cargar tareas (con useCallback para evitar warning de dependencias)
  const loadTasks = useCallback(async () => {
    if (!shelterId) return;
    
    try {
      setLoading(true);
      const response = await taskService.getFormattedTasks(shelterId);
      setTasks(response.data);
      setFilteredTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar las tareas:", err);
      setError("No se pudieron cargar las tareas");
      setLoading(false);
    }
  }, [shelterId]);
  
  // Función para filtrar tareas (con useCallback para evitar warning de dependencias)
  const filterTasks = useCallback(() => {
    let result = [...tasks];
    
    // Filtrar por etiquetas si hay alguna seleccionada
    if (activeFilters.tags.length > 0) {
      result = result.filter(task => activeFilters.tags.includes(task.tag));
    }
    
    // Filtrar por estado (completadas/pendientes)
    if (activeFilters.status !== null) {
      result = result.filter(task => task.completed === activeFilters.status);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredTasks(result);
  }, [tasks, activeFilters]);
  
  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Actualizar tareas filtradas cuando cambien tareas o filtros
  useEffect(() => {
    filterTasks();
  }, [filterTasks]);
  
  // Manejadores para el formulario de nueva tarea
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...newTask,
        shelter: shelterId
      };
      
      let response;
      
      if (editingTaskId) {
        // Actualizar tarea existente
        response = await taskService.updateTask(editingTaskId, taskData);
        
        // Actualizar el estado local
        setTasks(prev => prev.map(task => 
          task._id === editingTaskId ? response.data : task
        ));
        
        setEditingTaskId(null);
      } else {
        // Crear nueva tarea
        response = await taskService.createTask(taskData);
        
        // Añadir a estado local
        setTasks(prev => [response.data, ...prev]);
      }
      
      // Limpiar formulario
      setNewTask({
        title: '',
        description: '',
        tag: 'other',
        priority: 'medium'
      });
      
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      alert("Error al guardar la tarea");
    }
  };
  
  // Iniciar edición de una tarea
  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      tag: task.tag,
      priority: task.priority
    });
    setEditingTaskId(task._id);
    setShowForm(true);
    setExpandedTaskId(null);
  };
  
  // Eliminar una tarea
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }
    
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      alert("Error al eliminar la tarea");
    }
  };
  
  // Marcar/desmarcar tarea como completada
  const handleToggleComplete = async (taskId) => {
    try {
      console.log("Intentando marcar tarea como completada:", {
        taskId,
        isMember: isMemberInternal,
        userId
      });
      
      const response = await taskService.toggleTaskCompletion(taskId);
      console.log("Respuesta de la API:", response);
      
      // Actualizar el estado local de manera más segura
      setTasks(prev => {
        const updatedTasks = prev.map(task => {
          if (task._id === taskId) {
            return {
              ...task,
              ...response.data,
              // Asegurarse de que todos los campos necesarios estén presentes
              completed: response.data.completed,
              completedAt: response.data.completedAt,
              completedBy: response.data.completedBy
            };
          }
          return task;
        });
        return updatedTasks;
      });
    } catch (err) {
      console.error("Error al cambiar estado de la tarea:", err);
      
      // Mostrar detalles específicos del error
      if (err.response) {
        console.error("Detalles del error:", {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.status === 403) {
          alert("No tienes permisos para realizar esta acción. Verifica que eres miembro de esta protectora.");
        } else {
          alert(`Error al cambiar el estado de la tarea: ${err.response.data.message || "Error desconocido"}`);
        }
      } else {
        alert("No se pudo conectar con el servidor");
      }
    }
  };
  
  // Expandir/contraer una tarea
  const handleToggleExpand = (taskId, e) => {
    // Si el clic fue en un botón o en el checkbox, no expandir
    if (
      e.target.tagName === 'BUTTON' || 
      e.target.type === 'checkbox' ||
      e.target.closest('button') ||
      editingTaskId
    ) {
      return;
    }
    
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  };
  
  // Manejar filtros
  const handleFilterTag = (tag) => {
    setActiveFilters(prev => {
      const newTags = [...prev.tags];
      
      if (newTags.includes(tag)) {
        // Si ya está, quitarlo
        return { 
          ...prev, 
          tags: newTags.filter(t => t !== tag) 
        };
      } else {
        // Si no está, añadirlo
        return { 
          ...prev, 
          tags: [...newTags, tag]
        };
      }
    });
  };
  
  const handleFilterStatus = (status) => {
    setActiveFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status
    }));
  };
  
  // Formato de fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };
  
  // Renderizar indicadores de filtros activos
  const renderFilterIndicators = () => {
    if (activeFilters.tags.length === 0 && activeFilters.status === null) {
      return null;
    }
    
    return (
      <div className="active-filters">
        <span>Filtros activos:</span>
        {activeFilters.tags.map(tag => (
          <span 
            key={tag} 
            className={`filter-indicator tag-${tag}`}
            onClick={() => handleFilterTag(tag)}
          >
            {getTagText(tag)} ✕
          </span>
        ))}
        {activeFilters.status !== null && (
          <span 
            className={`filter-indicator status-${activeFilters.status}`}
            onClick={() => handleFilterStatus(activeFilters.status)}
          >
            {activeFilters.status ? 'Completadas' : 'Pendientes'} ✕
          </span>
        )}
      </div>
    );
  };
  
  // Función para obtener el texto de una etiqueta
  const getTagText = (tag) => {
    const tagMap = {
      'health': 'Salud',
      'food': 'Alimentación',
      'cleaning': 'Limpieza',
      'exercise': 'Ejercicio',
      'other': 'Otros'
    };
    return tagMap[tag] || tag;
  };
  
  // Función para obtener el texto de una prioridad
  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return priorityMap[priority] || priority;
  };

  // Renderizar estado de carga
  if (loading) {
    return <div className="taskboard-loading">Cargando tareas...</div>;
  }

  // Renderizar mensaje de error
  if (error) {
    return <div className="taskboard-error">{error}</div>;
  }

  return (
    <div className="taskboard">
      <div className="taskboard-header">
        <h2>Tablón de tareas</h2>
        {isAdmin && (
          <button
            className="task-create-button"
            onClick={() => {
              setShowForm(!showForm);
              setEditingTaskId(null);
              if (!showForm) {
                setNewTask({
                  title: '',
                  description: '',
                  tag: 'other',
                  priority: 'medium'
                });
              }
            }}
          >
            {showForm ? 'Cancelar' : 'Nueva tarea'}
          </button>
        )}
      </div>
      
      {/* Formulario para crear/editar tarea */}
      {showForm && (
        <form className="task-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Título*</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Descripción*</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleFormChange}
              rows="3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select 
                name="tag" 
                value={newTask.tag}
                onChange={handleFormChange}
              >
                <option value="health">Salud</option>
                <option value="food">Alimentación</option>
                <option value="cleaning">Limpieza</option>
                <option value="exercise">Ejercicio</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Prioridad</label>
              <select 
                name="priority" 
                value={newTask.priority}
                onChange={handleFormChange}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit">
              {editingTaskId ? 'Actualizar tarea' : 'Crear tarea'}
            </button>
          </div>
        </form>
      )}
      
      {/* Filtros de tareas */}
      <div className="task-filters">
        <div className="filter-section">
          <h4>Categorías</h4>
          <div className="filter-buttons">
            <button
              className={`filter-button tag-health ${activeFilters.tags.includes('health') ? 'active' : ''}`}
              onClick={() => handleFilterTag('health')}
            >
              🏥 Salud
            </button>
            <button
              className={`filter-button tag-food ${activeFilters.tags.includes('food') ? 'active' : ''}`}
              onClick={() => handleFilterTag('food')}
            >
              🍎 Alimentación
            </button>
            <button
              className={`filter-button tag-cleaning ${activeFilters.tags.includes('cleaning') ? 'active' : ''}`}
              onClick={() => handleFilterTag('cleaning')}
            >
              🧹 Limpieza
            </button>
            <button
              className={`filter-button tag-exercise ${activeFilters.tags.includes('exercise') ? 'active' : ''}`}
              onClick={() => handleFilterTag('exercise')}
            >
              🏋️ Ejercicio
            </button>
            <button
              className={`filter-button tag-other ${activeFilters.tags.includes('other') ? 'active' : ''}`}
              onClick={() => handleFilterTag('other')}
            >
              🔖 Otros
            </button>
          </div>
        </div>
        
        <div className="filter-section">
          <h4>Estado</h4>
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeFilters.status === false ? 'active' : ''}`}
              onClick={() => handleFilterStatus(false)}
            >
              ⏳ Pendientes
            </button>
            <button
              className={`filter-button ${activeFilters.status === true ? 'active' : ''}`}
              onClick={() => handleFilterStatus(true)}
            >
              ✅ Completadas
            </button>
          </div>
        </div>
      </div>
      
      {/* Indicadores de filtros activos */}
      {renderFilterIndicators()}
      
      {/* Lista de tareas */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks">
            <p>No hay tareas que mostrar</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task._id} 
              className={`task-item ${task.completed ? 'completed' : ''} ${expandedTaskId === task._id ? 'expanded' : ''}`}
            >
              <div 
                className="task-header" 
                onClick={(e) => handleToggleExpand(task._id, e)}
              >
                <div className="task-status">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => isMemberInternal && handleToggleComplete(task._id)}
                    disabled={!isMemberInternal}
                  />
                </div>
                
                <div className="task-title-section">
                  <h3 className="task-title">{task.title}</h3>
                  
                  <div className="task-meta">
                    <span className={`task-tag tag-${task.tag}`}>
                      {getTagText(task.tag)}
                    </span>
                    <span className={`task-priority priority-${task.priority}`}>
                      {getPriorityText(task.priority)}
                    </span>
                    
                    {task.completed && task.completedBy && (
                      <span className="task-completed-by">
                        Completada por @{task.completedBy.handle} - {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="task-actions">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="edit-button"
                      title="Editar tarea"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="delete-button"
                      title="Eliminar tarea"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              
              {expandedTaskId === task._id && (
                <div className="task-details">
                  <div className="task-description">
                    {task.description}
                  </div>
                  
                  <div className="task-info">
                    <div className="task-created-by">
                      <strong>Creada por:</strong>{' '}
                      {task.createdBy ? `@${task.createdBy.handle}` : 'Usuario desconocido'}{' '}
                      el {formatDate(task.createdAt)}
                    </div>
                    
                    {task.completed && task.completedBy && (
                      <div className="task-completed-info">
                        <strong>Completada por:</strong>{' '}
                        {`@${task.completedBy.handle}`} el{' '}
                        {formatDate(task.completedAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Taskboard;
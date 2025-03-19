import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../../../services/user.service';

const CompletedTasks = ({ userId, isOwnProfile, userName }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log("Cargando tareas completadas para usuario:", userId);
    
    userService.getCompletedTasks(userId)
      .then((response) => {
        console.log("Tareas completadas recibidas:", response.data);
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando tareas completadas:", error);
        setError("No se pudieron cargar las tareas completadas");
        setLoading(false);
      });
  }, [userId]);

  // Función para agrupar tareas por protectora
  const groupTasksByShelter = () => {
    const grouped = {};
    
    tasks.forEach(task => {
      if (!task || !task._id) return;
      
      // Extraer datos de shelter de forma segura
      const shelterName = task.shelter?.name || "Sin protectora";
      const shelterId = task.shelter?._id || "unknown";
      const shelterHandle = task.shelter?.handle || "";
      
      if (!grouped[shelterId]) {
        grouped[shelterId] = {
          name: shelterName,
          handle: shelterHandle,
          tasks: []
        };
      }
      
      grouped[shelterId].tasks.push(task);
    });
    
    return grouped;
  };

  // Función para traducir etiquetas y prioridades
  const translateField = (field, value) => {
    if (field === 'priority') {
      const priorityMap = {
        "low": "Baja",
        "medium": "Media",
        "high": "Alta"
      };
      return priorityMap[value] || value;
    }
    
    if (field === 'tag') {
      const tagMap = {
        "health": "Salud",
        "food": "Alimentación",
        "cleaning": "Limpieza",
        "exercise": "Ejercicio",
        "other": "Otros"
      };
      return tagMap[value] || value;
    }
    
    return value;
  };

  // Formateador de fechas seguro
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  // Si hay error, mostrarlo
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
        <p>{error}</p>
      </div>
    );
  }

  // Si no hay tareas, mostrar mensaje
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          {isOwnProfile 
            ? "Aún no has completado ninguna tarea." 
            : `${userName} aún no ha completado ninguna tarea.`}
        </p>
      </div>
    );
  }

  // Agrupar y mostrar tareas
  const groupedTasks = groupTasksByShelter();
  
  return (
    <div className="space-y-6">
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600">No hay tareas para mostrar</p>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([shelterId, shelter]) => (
          <div key={shelterId} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <h3 className="bg-gray-200 px-4 py-3 font-semibold text-gray-800">
              {shelter.handle ? (
                <Link 
                  to={`/shelters/${shelter.handle}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {shelter.name}
                </Link>
              ) : (
                shelter.name
              )}
            </h3>
            
            <div className="divide-y divide-gray-200">
              {shelter.tasks.map((task) => (
                <div key={task._id} className="p-4 hover:bg-gray-100 transition duration-150">
                  <h4 className="font-medium text-gray-800 mb-1">{task.title || "Sin título"}</h4>
                  
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.completedAt && (
                      <span className="inline-flex items-center text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {formatDate(task.completedAt)}
                      </span>
                    )}
                    
                    {task.priority && (
                      <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {translateField('priority', task.priority)}
                      </span>
                    )}
                    
                    {task.tag && (
                      <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                        task.tag === 'health' ? 'bg-blue-100 text-blue-800' : 
                        task.tag === 'food' ? 'bg-orange-100 text-orange-800' : 
                        task.tag === 'cleaning' ? 'bg-purple-100 text-purple-800' : 
                        task.tag === 'exercise' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        {translateField('tag', task.tag)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedTasks;
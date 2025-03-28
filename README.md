# PetPal - Plataforma para Protectoras de Animales

## Descripción

PetPal es una plataforma web diseñada para conectar protectoras de animales con voluntarios. Su objetivo es facilitar la gestión de tareas, el seguimiento de animales y coordinar la colaboración entre voluntarios y administradores de protectoras de forma centralizada.

El desarrollo del proyecto forma parte de un trabajo académico, y la idea surge tras conocer de primera mano las necesidades actuales de gestión en protectoras locales, donde la organización suele ser caótica y con recursos limitados. 

La aplicación permite a los usuarios:
- Crear y gestionar perfiles de protectoras de animales
- Administrar listados de animales bajo su cuidado (futura implementación)
- Coordinar tareas y voluntariados a través de un tablero de tareas
- Unirse como voluntario a diferentes protectoras
- Comunicarse con otros miembros y voluntarios (futura implementación)

[!NOTE]
Esta es la parte frontend del proyecto PETPAL. Para la API backend, visita el [repositorio backend](https://github.com/tu-usuario/petpal-backend).

## Contenido

- [Características principales](#características-principales)
- [Demo](#demo)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [API](#api)

## Características principales

### Para usuarios
- **Registro y autenticación segura**: Sistema de registro con validación de datos y autenticación JWT.
- **Perfiles personalizables**: Información personal, foto de perfil, ubicación y biografía.
- **Descubrimiento de protectoras**: Búsqueda y exploración de protectoras por nombre o ubicación.
- **Participación como voluntario**: Posibilidad de unirse a cualquier protectora como voluntario.
- - **Visualización de tareas completadas**: Seguimiento de contribuciones personales.

### Para protectoras
- **Creación de perfil**: Creación de página personalizada con información de contacto y ubicación.
- **Gestión de animales**: Registro detallado de cada animal (estado, características, historial).
- **Sistema de tareas**: Organización y seguimiento de tareas para voluntarios.
- **Administración de voluntarios**: Control de acceso y asignación de roles.
- **Tablón de tareas**: Sistema de organización con prioridades y categorías.

### Características técnicas
- **Diseño responsive**: Funciona en dispositivos móviles, tablets y escritorio.
- **Interfaz intuitiva**: Diseño moderno con retroalimentación visual para acciones.
- **Sistema de permisos**: Roles diferenciados (administrador, voluntario) con acceso adecuado.
- **Almacenamiento en la nube**: Posibilidad de almacenar imágenes de perfil y de animales.
- **Asistente IA**: Chatbot integrado para resolver dudas comunes, proporcionar información sobre protectoras de animales y ayudar con funciones de la plataforma.

## Demo

- [Enlace a la aplicación desplegada](https://petpalapp.netlify.app/)

## Tecnologías utilizadas

### Frontend
- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **React Router**: Navegación entre vistas
- **Context API**: Gestión del estado (autenticación, datos)
- **CSS personalizado**: Estilizado de componentes y diseño responsive
- **Axios**: Cliente HTTP para comunicarse con la API
- **Google Gemini API**: Integración de IA para el chatbot asistente

### Backend
- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JSON Web Tokens (JWT)**: Autenticación y autorización
- **bcrypt**: Encriptación de contraseñas
- **Validator**: Validación de datos en backend

### Herramientas de desarrollo
- **Git y GitHub**: Control de versiones
- **ESLint**: Linting de código
- **dotenv**: Gestión de variables de entorno
- **Postman**: Pruebas de API
- **MongoDB Atlas**: Hosting de base de datos
- **Render y Netlify**: Despliegue de aplicaciones

## Estructura del proyecto

El proyecto está dividido en dos repositorios principales

### Repositorio Frontend
```
src/
├── App.js                   # Componente principal de la aplicación
├── index.js                 # Punto de entrada de la aplicación
├── assets/                  # Recursos estáticos (imágenes, fonts)
├── components/              # Componentes reutilizables
│   ├── AnimalsList/         # Componente para listar animales
│   ├── Chatbot/             # Asistente IA integrado
│   ├── EditProfileForm/     # Formulario para editar perfiles
│   ├── EditShelterForm/     # Formulario para editar protectoras
│   ├── IsAnon/              # HOC para rutas de usuarios no autenticados
│   ├── IsPrivate/           # HOC para rutas privadas
│   ├── Loading/             # Componente de carga
│   └── Navbar/              # Barra de navegación
├── context/
│   └── auth.context.jsx     # Contexto de autenticación
├── pages/                   # Páginas principales
│   ├── AccessFormPage/      # Página de login/registro
│   ├── CreateShelterPage/   # Creación de protectora
│   ├── HomePage/            # Página principal
│   │   └── components/      # Componentes específicos para HomePage
│   ├── LandingPage/         # Página de bienvenida
│   │   └── components/      # Componentes específicos para LandingPage
│   ├── NotFoundPage/        # Error 404
│   ├── ProfilePage/         # Perfil de usuario
│   │   └── components/      # Componentes específicos para perfiles
│   ├── ShelterProfilePage/  # Perfil de protectora
│   │   └── components/      # Componentes específicos para protectoras
│   └── SheltersPage/        # Explorador de protectoras
│       └── components/      # Componentes para listado de protectoras
└── services/                # Servicios para comunicación con API
    ├── ai.service.js        # Servicio para chatbot IA
    ├── auth.service.js      # Servicio de autenticación
    ├── shelter.service.js   # Servicios para protectoras
    ├── stats.service.js     # Servicios para estadísticas
    ├── task.service.js      # Servicios para tareas
    └── user.service.js      # Servicios para usuarios
```

### Repositorio Backend
```
├── app.js                # Punto de entrada de la aplicación
├── server.js             # Configuración del servidor
├── db/                   # Conexión a la base de datos
├── config/               # Configuraciones (CORS, middleware, etc.)
│   └── ai.config.js      # Configuración para Gemini API
├── models/               # Modelos de datos (Mongoose)
│   ├── Animal.model.js   # Modelo para animales
│   ├── Shelter.model.js  # Modelo para protectoras
│   ├── Task.model.js     # Modelo para tareas
│   └── User.model.js     # Modelo para usuarios
├── routes/               # Rutas de la API
│   ├── animal.routes.js  # Endpoints para animales
│   ├── shelter.routes.js # Endpoints para protectoras
│   ├── task.routes.js    # Endpoints para tareas
│   ├── user.routes.js    # Endpoints para usuarios
│   ├── auth.routes.js    # Endpoints para autenticación
│   ├── stats.routes.js   # Endpoints para estadísticas
│   └── ai.routes.js      # Endpoints para integración con IA
├── middleware/           # Middlewares personalizados
│   ├── jwt.middleware.js        # Validación de tokens JWT
│   ├── permissions.middleware.js # Control de permisos
│   └── ai.middleware.js         # Validación para IA
├── services/             # Servicios externos
│   └── ai.service.js     # Servicio para comunicación con Gemini API
└── error-handling/       # Manejo de errores
```

## Uso

### Registro e inicio de sesión
1. Visita la página de inicio
2. Haz clic en "Registrate y entra"
3. Regístrate con email, contraseña y nombre de usuario (handle)
4. Inicia sesión con tus credenciales

### Crear un perfil de protectora
1. Inicia sesión en tu cuenta
2. Navega a "Crear Protectora" desde el menú de usuario
3. Completa el formulario con información de la protectora
4. Haz clic en "Crear protectora"

### Unirse a una protectora como voluntario
1. Navega a "Explorar Protectoras"
2. Busca y selecciona una protectora
3. En el perfil de la protectora, haz clic en "Unirse"

### Gestionar tareas
1. En el perfil de una protectora, ve a "Tablón de tareas"
2. Los administradores pueden crear nuevas tareas
3. Los voluntarios pueden ver y marcar tareas como completadas

## API

La API REST está organizada por recursos y sigue principios RESTful.

## Flujo de trabajo

1. La aplicación comienza con una landing page para usuarios anónimos
2. Los usuarios pueden registrarse o iniciar sesión
3. Después de iniciar sesión, se presenta la página de inicio
4. Desde allí, pueden acceder a su perfil, explorar protectoras o crear una nueva
5. Al unirse a una protectora, pueden ver y completar tareas
6. Durante toda la experiencia, los usuarios tienen acceso a un chatbot asistente de IA que puede responder preguntas sobre el uso de la plataforma, ofrecer orientación sobre protectoras de animales y proporcionar ayuda contextual

## Implementación y despliegue

### Frontend
El frontend está desplegado en [Netlify](https://netlify.com). La configuración incluye:
- Variables de entorno para la URL del backend
- Configuración de redirecciones para SPA
- Integración continua desde GitHub

### Backend
El backend está desplegado en [Render](https://render.com). La configuración incluye:
- Variables de entorno seguras
- Conexión a MongoDB Atlas
- Configuración CORS para permitir solicitudes desde el frontend

## Estado del proyecto

PetPal se encuentra actualmente en una fase muy temprana de desarrollo (MVP - Producto Mínimo Viable). Lo que presento aquí representa los fundamentos de mi visión para este producto, pero varios aspectos son preliminares:

- Los elementos de marca (nombre, logo, identidad visual) son provisionales y cambiarán en el futuro.
- La arquitectura de la aplicación probablemente experimentará modificaciones importantes.
- La interfaz de usuario actual es funcional pero necesita mucho refinamiento.
- Tengo planificadas varias funcionalidades clave que aún no he podido implementar.

Mi enfoque actual se centra en:
- Validar el concepto con usuarios reales de protectoras locales que conozco
- Establecer una base técnica sólida que me permita iterar rápidamente
- Identificar qué debo priorizar basándome en el feedback que recibo
- Implementar gradualmente las funcionalidades más críticas

Comparto este estado inicial porque creo en el desarrollo transparente y colaborativo, y porque me ayuda a mantener expectativas realistas mientras trabajo para convertir esta idea en una herramienta verdaderamente útil.

## Próximas mejoras

Tengo varias ideas y mejoras planificadas para las próximas versiones:

- **Notificaciones**: Sistema de alertas en tiempo real para mantener a todos informados.
- **Filtros avanzados**: Mejora en la búsqueda de animales y protectoras para facilitar conexiones.
- **Estadísticas**: Paneles de análisis para que las protectoras puedan evaluar su trabajo.
- **Localización geográfica**: Búsqueda por proximidad para potenciar el voluntariado local.
- **Chat interno**: Sistema de mensajería entre voluntarios para mejor coordinación.
- **Calendario de eventos**: Organización de actividades y gestión de turnos.
- **Aplicación móvil**: Versión nativa para iOS y Android que estoy considerando a largo plazo.

Estas mejoras las priorizaré según el feedback que reciba de los usuarios iniciales y las necesidades que identifique durante las primeras pruebas.

¡No dudes en contactarme si tienes preguntas o ideas para colaborar!

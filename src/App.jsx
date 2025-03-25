import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";

// Importar páginas
import LandingPage from "./pages/LandingPage/LandingPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AccessFormPage from "./pages/AccessFormPage/AccessFormPage";
import SheltersPage from "./pages/SheltersPage/SheltersPage";
import ShelterProfilePage from "./pages/ShelterProfilePage/ShelterProfilePage";
import CreateShelterPage from "./pages/CreateShelterPage/CreateShelterPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

//Importar componentes
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import Chatbot from "./components/Chatbot/Chatbot";
import { AuthContext } from "./context/auth.context";

function App() {

const location = useLocation();
const excludeBackground = location.pathname === '/access';
const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className={`App ${excludeBackground ? 'no-background' : ''}`}>
      <Navbar />

      <Routes>
        {/* Rutas solo visibles para el usuario anónimo */}
        <Route path="/" element={<IsAnon> <LandingPage /> </IsAnon> } />
        <Route path="/access" element={ <IsAnon> <AccessFormPage /> </IsAnon> } />

        {/* Rutas visibles para usuarios anónimos y conectados */}
        <Route path="/shelters" element={<SheltersPage />} />
        <Route path="/shelters/:shelterHandle/*" element={<ShelterProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Rutas solo visibles para el usuario registrado y conectado */}
        <Route path="/home" element={<IsPrivate> <HomePage /> </IsPrivate>} />
        <Route path="/create-shelter" element={ <IsPrivate> <CreateShelterPage /> </IsPrivate> } />

        {/* Rutas dinámicas */}
          {/* Ruta para ver perfiles de usuario por handle (incluido el propio) */}
          <Route
            path="/:userHandle"
            element={
              <IsPrivate>
                <ProfilePage />
              </IsPrivate>
            }
          />

      </Routes>

      {isLoggedIn && <Chatbot />}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );
}

export default App;

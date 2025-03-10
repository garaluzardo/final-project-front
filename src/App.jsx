import "./App.css";
import { Routes, Route } from "react-router-dom";

// Importar páginas
import LandingPage from "./pages/LandingPage/LandingPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AccessFormPage from "./pages/AccessFormPage/AccessFormPage";
import SheltersPage from "./pages/SheltersPage/SheltersPage";
import ShelterProfilePage from "./pages/ShelterProfilePage/ShelterProfilePage";
import CreateShelterPage from "./pages/CreateShelterPage/CreateShelterPage";

//Importar componentes
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        {/* Rutas solo visibles para el usuario anónimo */}
        <Route path="/" element={<IsAnon> <LandingPage /> </IsAnon> } />
        <Route path="/access" element={ <IsAnon> <AccessFormPage /> </IsAnon> } />

        {/* Rutas visibles para usuarios anónimos y conectados */}
        <Route path="/shelters" element={<SheltersPage />} />
        <Route path="/shelters/:shelterHandle/*" element={<ShelterProfilePage />} />

        {/* Rutas solo visibles para el usuario registrado y conectado */}
        <Route path="/home" element={<IsPrivate> <HomePage /> </IsPrivate>} />
        <Route path="/create-shelter" element={ <IsPrivate> <CreateShelterPage /> </IsPrivate> } />

        {/* Rutas para perfil de usuario */}
          {/* Ruta alternativa /profile que redirige al perfil con handle */}
          <Route
            path="/profile"
            element={
              <IsPrivate>
                <ProfilePage />
              </IsPrivate>
            }
          />

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
    </div>
  );
}

export default App;

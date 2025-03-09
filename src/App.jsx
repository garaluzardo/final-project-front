import "./App.css";
import { Routes, Route } from "react-router-dom";

// Importar páginas
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
        <Route path="/" element={<HomePage />} />
        <Route path="/shelters" element={<SheltersPage />} />
        <Route path="/shelters/:shelterHandle/*" element={<ShelterProfilePage />} />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />

        <Route
          path="/access"
          element={
            <IsAnon>
              <AccessFormPage />
            </IsAnon>
          }
        />

        <Route
          path="/create-shelter"
          element={
            <IsPrivate>
              <CreateShelterPage />
            </IsPrivate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

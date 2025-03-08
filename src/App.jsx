import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AccessFormPage from "./pages/AccessFormPage/AccessFormPage";
import TestLoginPage from "./pages/TestLoginPage";

import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

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

<Route path="/test-login" element={<TestLoginPage />} />

      </Routes>
    </div>
  );
}

export default App;

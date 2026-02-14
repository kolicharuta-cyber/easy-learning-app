import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import LoginScreen from "./app/auth/LoginScreen";
import RegisterScreen from "./app/auth/RegisterScreen";
import HomeScreen from "./app/home/HomeScreen";
import UploadNotesScreen from "./app/upload/UploadNotesScreen";
import StudyModeScreen from "./app/study/StudyModeScreen";
import TestModeScreen from "./app/test/TestModeScreen";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("easylearning_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleRegister = () => setIsLoggedIn(true);

  const handleLogout = () => {
    sessionStorage.removeItem("easylearning_token");
    setIsLoggedIn(false);
  };

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{ fontFamily: "Arial" }}>
      {/* HEADER */}
      {!hideHeader && isLoggedIn && (
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <h2>Easy Learning App</h2>
          <button onClick={handleLogout} style={buttonStyle}>
            Logout
          </button>
        </header>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginScreen onLogin={handleLogin} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <RegisterScreen onRegister={handleRegister} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/home"
          element={isLoggedIn ? <HomeScreen /> : <Navigate to="/login" />}
        />

        <Route
          path="/upload"
          element={isLoggedIn ? <UploadNotesScreen /> : <Navigate to="/login" />}
        />

        {/* ✅ FIXED STUDY ROUTE */}
        <Route
          path="/study"
          element={isLoggedIn ? <StudyModeScreen /> : <Navigate to="/login" />}
        />

        {/* ✅ FIXED TEST ROUTE */}
        <Route
          path="/test"
          element={isLoggedIn ? <TestModeScreen /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const buttonStyle = {
  backgroundColor: "#000",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

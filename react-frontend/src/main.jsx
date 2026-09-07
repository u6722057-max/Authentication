import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles.css";
import TestApi from "./pages/TestApi";
import Home from "./pages/Home";
import Login from "./Login";
import { UserContext, UserProvider } from "./context/UserContext";
import { useContext } from "react";

function ProtectedRoute({ children }) {
  const { isLoggedIn, isInitializing } = useContext(UserContext);
  if (isInitializing) return <main className="loading">Checking session...</main>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/test_api" element={<ProtectedRoute><TestApi /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode><UserProvider><BrowserRouter><App /></BrowserRouter></UserProvider></StrictMode>,
);

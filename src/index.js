import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Ensure this path is correct
import reportWebVitals from './reportWebVitals';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  const handleLogin = () => {
    setIsAuthenticated(true); // Set authenticated state
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Clear authenticated state
    sessionStorage.removeItem('adminData'); // Clear session storage
  };
  return (
    <Router>
      <Routes>
        {/* Redirect to /home if authenticated, otherwise go to /login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Register route, accessible for unauthenticated users */}
        <Route path="/register" element={<Register />} />
        
        {/* Home route, accessible only when authenticated */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        
        {/* Dashboard route, accessible only when authenticated */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

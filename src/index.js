import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Ensure this path is correct
import reportWebVitals from './reportWebVitals';
import Dashboard from './pages/Dashboard';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('isAuthenticated') // Check if authenticated state is in sessionStorage
  );

  // Handle login and store authenticated state in sessionStorage
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true'); // Store authentication status
  };

  // Handle logout and clear session storage
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated'); // Remove authentication status
  };

  // Component for handling logout and navigating to login
  const ParentComponent = () => {
    const navigate = useNavigate();
  
    const handleLogoutClick = () => {
      handleLogout();
      navigate('/login'); // Redirect to login after logout
    };
  
    return <Dashboard onLogout={handleLogoutClick} />;
    return <Home onLogout={handleLogoutClick} />;
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
        <Route path="/home" element={isAuthenticated ? <ParentComponent /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <ParentComponent /> : <Navigate to="/login" />} />
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

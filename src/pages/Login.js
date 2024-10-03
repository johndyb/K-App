import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config'; 
import { Navigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import './login.css';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(false); // State for redirecting after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const q = query(collection(db, 'admin'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === password) {
          sessionStorage.setItem('adminData', JSON.stringify(userData));
          onLogin(userData); // Call onLogin here
          setRedirect(true);
        } else {
          Swal.fire({
            title: "Invalid Credentials",
            text: 'Invalid password!',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          setErrorMessage("Invalid password");
        }
      } else {
        Swal.fire({
          title: "Invalid Credentials ",
          text: 'User not found!',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        setErrorMessage("User not found");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setErrorMessage("Error logging in. Please try again.");
    }
  };

  // Return early if redirecting
  if (redirect) {
    return <Navigate to="/home" />;
  }

  return ( // Ensure that the return statement wraps your JSX
    <div className="container11">
      <div className="wrapper11">
        <div className="title">Login</div>
        <img src="./images/1.jpg" alt="" className="round-image"/>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         
          <div className="button">
            <input type="submit" value="Login" />
          </div>
        
          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign Up</Link> {/* Corrected link case */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

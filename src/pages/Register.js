import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import './register.css'; // Ensure you import the CSS file
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link from react-router-dom
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to check if admin already exists
  const checkIfUserExists = async (name) => {
    const q = query(collection(db, 'admin'), where('name', '==', name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // returns true if user exists, false otherwise
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Passwords do not match",
        text: 'Error!',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      // Check if admin with this name (email) already exists
      const userExists = await checkIfUserExists(name);
      if (userExists) {
        Swal.fire({
          title: "Error",
          text: 'User already exists!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setErrorMessage('User already exists!');
        return;
      }

      const uniqueId = uuidv4();

      // Add the new admin to Firestore if they don't exist
      await addDoc(collection(db, 'admin'), {
        id: uniqueId,
        name,
        password, // In a real app, hash the password before storing it!
      });

      console.log('Admin registered successfully:', { name });
      setName('');
      setPassword('');
      setConfirmPassword('');
      Swal.fire({
        title: "Success",
        text: 'Registered successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Navigate to the login page after successful registration
        navigate('/login');
      });
      
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: 'Error registering. Please try again!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Error adding document: ', error);
      setErrorMessage('Error registering. Please try again.');
    }
  };

  return (
    <div className="container22">
      <div className="form-wrapper22">
        <h2 className="form-title">Signup</h2>
        <center><img src="./images/1.jpg" alt="" className="round-image" /></center>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            id="username"
            name="username"
            type="text"
            className="input-field"
            placeholder="Email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            className="input-field"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            className="input-field"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="button22">Signup</button>

          <div className="or-divider">
            <div className="line"></div>
            <span>Or</span>
            <div className="line"></div>
          </div>

          <div className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

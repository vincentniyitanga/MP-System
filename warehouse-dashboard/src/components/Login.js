// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Successful login - store JWT token in localStorage
      localStorage.setItem('token', data.token);

      // Navigate to the dashboard based on the user role
      navigate(`/${data.role}-dashboard`);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p
        onClick={() => navigate('/forgot-password')}
        style={{ color: 'blue', cursor: 'pointer', marginTop: '10px' }}
      >
        Forgot Password?
      </p>
    </div>
  );
}

export default Login;
// src/components/ForgotPassword.js

import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Password reset link sent! Please check your email.');
      } else {
        alert(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button onClick={handlePasswordReset}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;
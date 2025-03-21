// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role) navigate(`/login?role=${role}`);
  };

  return (
    <div className="home">
      <h1>MP Warehouse</h1>
      <div>
        <label>Login as:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="clerk">Clerk</option>
          <option value="accountant">Accountant</option>
        </select>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Home;
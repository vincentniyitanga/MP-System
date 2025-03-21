// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import ClerkDashboard from './components/ClerkDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
        <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
         
         
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

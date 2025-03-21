// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>MP Warehouse</h1>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/manager-dashboard">Manager Dashboard</Link>
        <Link to="/clerk-dashboard">Clerk Dashboard</Link>
        <Link to="/accountant-dashboard">Accountant Dashboard</Link>
      </nav>
    </header>
  );
}

export default Header;
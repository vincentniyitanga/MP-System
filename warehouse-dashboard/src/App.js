// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Components
import Login from "./components/Login";
import ManagerDashboard from "./components/ManagerDashboard";
import ClerkDashboard from "./components/ClerkDashboard";
import AccountantDashboard from "./components/AccountantDashboard";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
          <Route
            path="/accountant-dashboard"
            element={<AccountantDashboard />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

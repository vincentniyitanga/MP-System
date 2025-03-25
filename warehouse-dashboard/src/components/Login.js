// src/components/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Custom styled components
const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  padding: theme.spacing(3),
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 450,
  width: "100%",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
}));

const Logo = styled("img")({
  width: 180,
  marginBottom: 24,
  height: "auto",
});

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Attempting login with:", { username, password, role }); // Debug log
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error("Selected role does not match user's assigned role");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      navigate(`/${data.role}-dashboard`);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.message || "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard elevation={3}>
        <Logo src="/images/sbl-logo.png" alt="SKOL Brewery Limited" />
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
        >
          Warehouse Management System
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Form onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="clerk">Clerk</MenuItem>
              <MenuItem value="accountant">Accountant</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/forgot-password")}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Forgot Password?
          </Button>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;

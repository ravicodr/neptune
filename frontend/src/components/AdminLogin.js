import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import logo from "../assets/logo.jpg"; // Import the logo
import api from "../api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await api.post("/admin/login", { email, password });
    console.log("Login result:", response);

    setLoading(false);

    if (response) {
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminToken", response.data.access_token);
      navigate("/admin-dashboard");
    } else {
      setSnackbarMessage("Invalid credentials");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ bgcolor: "white", color: "black", padding: 3 }}
    >
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </Box>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ color: "orange" }}
        >
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email ID"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "lightgray", // Default label color
                "&.Mui-focused": {
                  color: "green", // Label color when focused
                },
              },
            }}
            sx={{
              bgcolor: "#f9f9f9", // Light background for input
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "lightgray", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "green", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "green", // Border color when focused
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "lightgray", // Default label color
                "&.Mui-focused": {
                  color: "green", // Label color when focused
                },
              },
            }}
            sx={{
              bgcolor: "#f9f9f9", // Light background for input
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "lightgray", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "green", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "green", // Border color when focused
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "orange", // Button color
              "&:hover": { bgcolor: "#ff8c00" }, // Button hover color
              color: "white", // Button text color
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Admin Sign In"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminLogin;

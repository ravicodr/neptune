import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Link as MuiLink,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.jpg"; // Import the logo

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(phoneNumber, password);
    console.log("Login result:", result);

    setLoading(false);

    if (result) {
      navigate("/");
    } else if (error) {
      setSnackbarMessage(error);
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            autoFocus
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
            autoComplete="current-password"
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
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "green",
                fontSize: "0.9rem",
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
            <MuiLink
              component={Link}
              to="/admin-login"
              variant="body2"
              sx={{ color: "orange", fontSize: "0.9rem" }}
            >
              Admin Login
            </MuiLink>
          </Box>
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

export default Login;

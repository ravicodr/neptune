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
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState(1234567890);
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const { login, error } = useAuth(); // Destructure login function and error from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    // Attempt to login using the AuthContext
    const result = await login(phoneNumber, password);
    
    
    if (result && !error) {
      navigate("/dashboard"); // Navigate to the dashboard on successful login
    } else if (error) {
      setSnackbarMessage(error); // Set the snackbar message to display the error
      setSnackbarOpen(true); // Open the snackbar for error message
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the snackbar
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              {"Don't have an account? Sign Up"}
            </Link>
            <MuiLink component={Link} to="/adminLogin" variant="body2">
              Admin Login
            </MuiLink>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for error messages */}
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

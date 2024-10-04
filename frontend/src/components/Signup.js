import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext
import logo from "../assets/logo.jpg"; // Import the logo

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { signup, error } = useAuth(); // Destructure signup function and error from AuthContext

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      phoneNumber.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords don't match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Set loading to true before signup

    // Call the signup function from AuthContext
    const result = await signup(phoneNumber, password);

    setLoading(false); // Set loading to false after signup

    if (result) {
      setSnackbarMessage("User created successfully!"); // Success message
      setSnackbarSeverity("success");
      navigate("/cv-upload"); // Navigate to CV upload page on successful signup
    } else if (error) {
      setSnackbarMessage(error); // Set the snackbar message to display the error
      setSnackbarSeverity("error"); // Set severity to error
      setSnackbarOpen(true); // Open the snackbar
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto" }} // Logo styling
          />
        </Box>
        <Avatar sx={{ mx: "auto", bgcolor: "orange" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ color: "orange" }}
        >
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
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
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "green" }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>

        {/* Snackbar for error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext for authentication
import api from "../api"; // Import the apiService for API calls
import logo from "../assets/logo.jpg"; // Import the logo

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to hold the selected file name
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Add loading state
  const { user, setUser, token } = useAuth(); // Access user information from AuthContext
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Set the selected file
    setFileName(selectedFile ? selectedFile.name : ""); // Set the file name
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setSnackbarMessage("Please select a CV file to upload");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Set loading to true before starting the upload

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call the upload API
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Upload response:", response);

      setUser(response.data);
      setSnackbarMessage("CV uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Pass the uploaded CV data to the ProfileCompletion page
      navigate("/profile-completion", {
        state: { profileData: response.data },
      });
    } catch (error) {
      setSnackbarMessage(error.message || "Error uploading CV");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Set loading to false after the upload attempt
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, backgroundColor: "#f5f5f5" }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "200px", height: "auto" }} // Logo styling
          />
        </Box>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ mb: 2, color: "orange" }}
        >
          Upload Your CV
        </Typography>
        <Box
          component="form"
          onSubmit={handleUpload}
          noValidate
          sx={{ mt: 3, width: "100%" }}
        >
          <input
            accept=".pdf, .doc, .docx"
            style={{ display: "none" }}
            id="cv-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="cv-upload">
            <Button
              variant="outlined"
              component="span"
              sx={{
                mt: 2,
                width: "100%",
                textTransform: "none",
                borderColor: "green",
                color: "green",
              }}
            >
              Choose CV
            </Button>
          </label>

          {/* Display the selected file name */}
          {fileName && (
            <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
              Selected File: {fileName}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "orange", // Button color
              "&:hover": { bgcolor: "#ff8c00" }, // Button hover color
              color: "white", // Button text color
            }}
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : "Upload CV"}
          </Button>
        </Box>

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

export default CVUpload;

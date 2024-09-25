import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext for authentication
import { apiService } from "../api"; // Import the apiService for API calls

const CVUpload = () => {
  const [file, setFile] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { user } = useAuth(); // Access user information from AuthContext

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setSnackbarMessage("Please select a CV file to upload");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call the upload API
      const response = await apiService.uploadFile(formData);
      console.log("Upload response:", response);

      // Save extracted data to localStorage
      localStorage.setItem("profileData", JSON.stringify(response));

      setSnackbarMessage("CV uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/profile-completion");
    } catch (error) {
      setSnackbarMessage(error.message || "Error uploading CV");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Upload Your CV
      </Typography>
      <Box component="form" onSubmit={handleUpload} noValidate sx={{ mt: 3 }}>
        <input
          accept=".pdf, .doc, .docx"
          style={{ display: "none" }}
          id="cv-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="cv-upload">
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Choose CV
          </Button>
        </label>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Upload CV
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
    </Box>
  );
};

export default CVUpload;

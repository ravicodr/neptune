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
import api from "../api"; // Import the apiService for API calls

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to hold the selected file name
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
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
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        padding: 4,
        boxShadow: 2,
        maxWidth: 640,
        mx: "auto",
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
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
            sx={{ mt: 2, width: "100%", textTransform: "none" }}
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

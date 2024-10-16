import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import api from "../api"; // Import the api service
import logo from "../assets/logo.jpg";

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setSnackbarMessage("Please select a CV file to upload");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      console.log("Raw API response:", response.data);

      let profileData = {};
      let errorMessage = null;

      // Assuming the response.data is a string containing JSON objects separated by newlines
      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsedData = JSON.parse(line);
            if (parsedData.type === 'error') {
              errorMessage = parsedData.content;
            } else {
              profileData = { ...profileData, ...parsedData };
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

     

      if (Object.keys(profileData).length === 0) {
        throw new Error("No valid profile data extracted from the response");
      }

      setSnackbarMessage("CV uploaded and processed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      console.log("Profile data to be passed:", profileData);
      navigate("/profile-completion", { state: { profileData } });
    } catch (error) {
      console.error("Error in CV upload:", error);
      setSnackbarMessage(error.message || "Error uploading CV");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setUploadProgress(0);
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
            style={{ width: "200px", height: "auto" }}
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
              bgcolor: "orange",
              "&:hover": { bgcolor: "#ff8c00" },
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" />
                {uploadProgress > 0 && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {`${uploadProgress}%`}
                  </Typography>
                )}
              </>
            ) : (
              "Upload CV"
            )}
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
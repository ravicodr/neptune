import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  LinearProgress,
  Container,
} from "@mui/material";

const initialProfileData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  education: {
    itiTrade: "",
    tenthMarks: "",
  },
  parentInfo: {
    income: "",
    occupation: "",
  },
};

const ProfileCompletion = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("profileData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProfileData((prevData) => ({
          ...initialProfileData,
          personalInfo: {
            ...initialProfileData.personalInfo,
            ...parsedData.personalInfo,
          },
          education: {
            ...initialProfileData.education,
            ...parsedData.education,
          },
          parentInfo: {
            ...initialProfileData.parentInfo,
            ...parsedData.parentInfo,
          },
        }));
      } catch (error) {
        console.error("Error parsing stored data:", error);
        setProfileData(initialProfileData);
      }
    }
  }, []);

  useEffect(() => {
    const totalFields = Object.values(initialProfileData).reduce(
      (acc, section) => acc + Object.keys(section).length,
      0
    );
    const filledFields = Object.values(profileData).reduce(
      (acc, section) =>
        acc + Object.values(section).filter((value) => value !== "").length,
      0
    );
    setCompletionPercentage((filledFields / totalFields) * 100);
  }, [profileData]);

  const handleChange = (section, field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Complete Your Profile
        </Typography>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{ mb: 2, height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" gutterBottom align="center">
          {`Profile Completion: ${Math.round(completionPercentage)}%`}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(profileData.personalInfo).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChange={(e) =>
                      handleChange("personalInfo", key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(profileData.education).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={key === "itiTrade" ? "ITI Trade" : "10th Marks (%)"}
                    type={key === "tenthMarks" ? "number" : "text"}
                    value={value}
                    onChange={(e) =>
                      handleChange("education", key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parent Information
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(profileData.parentInfo).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={
                      key === "income"
                        ? "Parent's Annual Income"
                        : "Parent's Occupation"
                    }
                    type={key === "income" ? "number" : "text"}
                    value={value}
                    onChange={(e) =>
                      handleChange("parentInfo", key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
        >
          Save and Continue
        </Button>
      </Box>
    </Container>
  );
};

export default ProfileCompletion;

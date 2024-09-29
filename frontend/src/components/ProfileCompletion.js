import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const initialProfileData = {
  additionalInfo: {
    otherInformation: "",
  },
  education: {
    graduationDegree: "",
    tenthBoardMarks: {
      marks: "NA",
      percentage: "NA",
    },
  },
  familyInfo: {
    fathersProfession: "",
    mothersProfession: "",
    parentsAnnualIncome: "",
  },
  futureGoals: {
    fiveYearVision: "",
  },
  interests: {
    hobbies: [],
  },
  personalInfo: {
    category: "",
    emailId: "",
    name: "",
    number: [],
    religion: "",
  },
  professionalInfo: {
    postAppliedFor: "",
  },
  situationalJudgment: {
    lateWorkScenario: "",
  },
};

const ProfileCompletion = () => {
  const { token } = useAuth();
  const location = useLocation();
  const [profileData, setProfileData] = useState(initialProfileData);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.profileData) {
      const incomingProfileData = location.state.profileData;
      const updatedProfileData = {
        ...initialProfileData,
        ...incomingProfileData,
      };

      setProfileData(updatedProfileData);
    }
  }, [location.state]);

  useEffect(() => {
    const countFields = (obj) => {
      return Object.values(obj).reduce((acc, value) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return acc + countFields(value);
        }
        return acc + 1;
      }, 0);
    };

    const countFilledFields = (obj) => {
      return Object.values(obj).reduce((acc, value) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return acc + countFilledFields(value);
        }
        return acc + (value !== "" && value !== null && value !== "NA" ? 1 : 0);
      }, 0);
    };

    const totalFields = countFields(profileData);
    const filledFields = countFilledFields(profileData);

    setCompletionPercentage(
      totalFields > 0 ? (filledFields / totalFields) * 100 : 0
    );
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

  const handleNestedChange = (section, subSection, field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [subSection]: {
          ...prevData[section][subSection],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    const isEmpty = (obj) => {
      return Object.values(obj).some((value) => {
        if (typeof value === "object" && value !== null) {
          return isEmpty(value);
        }
        return (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        );
      });
    };

    if (isEmpty(profileData)) {
      console.error("Error: Some fields in profile data are empty.");
      return;
    }

    try {
      const response = await api.put(
        "/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        navigate("/dashboard");
      } else {
        console.error("Error updating profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting profile data:", error);
    }
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
        {/* Personal Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(profileData.personalInfo).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    required
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

        {/* Education Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Graduation Degree"
                  value={profileData.education.graduationDegree}
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "graduationDegree",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="10th Marks"
                  value={profileData.education.tenthBoardMarks.marks}
                  onChange={(e) =>
                    handleNestedChange(
                      "education",
                      "tenthBoardMarks",
                      "marks",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="10th Percentage"
                  value={profileData.education.tenthBoardMarks.percentage}
                  onChange={(e) =>
                    handleNestedChange(
                      "education",
                      "tenthBoardMarks",
                      "percentage",
                      e.target.value
                    )
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Family Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Family Information
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(profileData.familyInfo).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    required
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChange={(e) =>
                      handleChange("familyInfo", key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Future Goals Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Future Goals
            </Typography>
            <TextField
              fullWidth
              label="5-Year Vision"
              value={profileData.futureGoals.fiveYearVision}
              onChange={(e) =>
                handleChange("futureGoals", "fiveYearVision", e.target.value)
              }
            />
          </Paper>
        </Grid>

        {/* Interests Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interests
            </Typography>
            <TextField
              fullWidth
              label="Hobbies"
              value={profileData.interests.hobbies.join(", ")}
              onChange={(e) =>
                handleChange("interests", "hobbies", e.target.value.split(", "))
              }
            />
          </Paper>
        </Grid>

        {/* Professional Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            <TextField
              fullWidth
              label="Post Applied For"
              value={profileData.professionalInfo.postAppliedFor}
              onChange={(e) =>
                handleChange(
                  "professionalInfo",
                  "postAppliedFor",
                  e.target.value
                )
              }
            />
          </Paper>
        </Grid>

        {/* Situational Judgment Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Situational Judgment
            </Typography>
            <TextField
              fullWidth
              label="Late Work Scenario"
              value={profileData.situationalJudgment.lateWorkScenario}
              onChange={(e) =>
                handleChange(
                  "situationalJudgment",
                  "lateWorkScenario",
                  e.target.value
                )
              }
            />
          </Paper>
        </Grid>

        {/* Additional Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <TextField
              fullWidth
              label="Other Information"
              value={profileData.additionalInfo.otherInformation}
              onChange={(e) =>
                handleChange(
                  "additionalInfo",
                  "otherInformation",
                  e.target.value
                )
              }
            />
          </Paper>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={completionPercentage < 100}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileCompletion;

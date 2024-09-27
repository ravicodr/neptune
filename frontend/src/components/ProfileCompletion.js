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
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const initialProfileData = {
  personalInfo: {
    name: "",
    emailId: "",
    mobileNumber: [""],
    category: "",
    religion: "",
  },
  education: {
    graduationDegree: {
      degree: "",
      university: "",
      year: "",
    },
    tenthBoardMarks: {
      marks: "",
      percentage: "",
    },
    twelfthBoardMarks: {
      marks: "",
      percentage: "",
    },
  },
  familyInfo: {
    fathersProfession: "",
    mothersProfession: "",
    parentsAnnualIncome: "",
  },
  workExperience: [], // Start with an empty array for work experience
  futureGoals: {
    fiveYearVision: "",
  },
  interests: {
    hobbies: [],
  },
  professionalInfo: {
    postAppliedFor: "",
  },
  situationalJudgment: {
    lateWorkScenario: "",
  },
  additionalInfo: {
    otherInformation: "",
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
    const totalFields = Object.values(profileData).reduce(
      (acc, section) => acc + (section ? Object.keys(section).length : 0),
      0
    );
    const filledFields = Object.values(profileData).reduce(
      (acc, section) =>
        acc +
        (section
          ? Object.values(section).filter((value) => value !== "").length
          : 0),
      0
    );
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

  const handleAddWorkExperience = () => {
    setProfileData((prevData) => ({
      ...prevData,
      workExperience: [
        ...prevData.workExperience,
        { company: "", duration: "", jobTitle: "" },
      ],
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setProfileData((prevData) => {
      const newWorkExperience = [...prevData.workExperience];
      newWorkExperience.splice(index, 1);
      return { ...prevData, workExperience: newWorkExperience };
    });
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
      const response = await axios.put(
        "http://localhost:5000/profile",
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
              {Object.entries(profileData.education.graduationDegree || {}).map(
                ([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      required
                      fullWidth
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={value}
                      onChange={(e) =>
                        handleNestedChange(
                          "education",
                          "graduationDegree",
                          key,
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                )
              )}
              {Object.entries(profileData.education.tenthBoardMarks || {}).map(
                ([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      required
                      fullWidth
                      label={`10th ${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }`}
                      value={value}
                      onChange={(e) =>
                        handleNestedChange(
                          "education",
                          "tenthBoardMarks",
                          key,
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                )
              )}
              {Object.entries(
                profileData.education.twelfthBoardMarks || {}
              ).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    required
                    fullWidth
                    label={`12th ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    value={value}
                    onChange={(e) =>
                      handleNestedChange(
                        "education",
                        "twelfthBoardMarks",
                        key,
                        e.target.value
                      )
                    }
                  />
                </Grid>
              ))}
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

        {/* Work Experience Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            {profileData.workExperience.map((experience, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label="Company"
                    value={experience.company}
                    onChange={(e) =>
                      setProfileData((prevData) => {
                        const newExperience = [...prevData.workExperience];
                        newExperience[index].company = e.target.value;
                        return { ...prevData, workExperience: newExperience };
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label="Job Title"
                    value={experience.jobTitle}
                    onChange={(e) =>
                      setProfileData((prevData) => {
                        const newExperience = [...prevData.workExperience];
                        newExperience[index].jobTitle = e.target.value;
                        return { ...prevData, workExperience: newExperience };
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label="Duration"
                    value={experience.duration}
                    onChange={(e) =>
                      setProfileData((prevData) => {
                        const newExperience = [...prevData.workExperience];
                        newExperience[index].duration = e.target.value;
                        return { ...prevData, workExperience: newExperience };
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveWorkExperience(index)}
                  >
                    Remove Experience
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="contained" onClick={handleAddWorkExperience}>
              Add Work Experience
            </Button>
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
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileCompletion;

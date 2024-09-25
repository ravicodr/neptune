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
import axios from "axios"; // Make sure axios is installed

const initialProfileData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    category: null,
    religion: null,
  },
  education: {
    graduationDegree: "",
    graduationUniversity: "",
    graduationYear: "",
    tenthMarks: "",
    twelfthMarks: "",
    tenthBoardMarks: {
      marks: "",
      percentage: "",
    },
  },
  familyInfo: {
    fatherProfession: "",
    motherProfession: "",
    parentsAnnualIncome: "",
  },
  workExperience: [],
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
  const [profileData, setProfileData] = useState(initialProfileData);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("profileData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProfileData({
          personalInfo: {
            name: parsedData.personalInfo?.name || "",
            email: parsedData.personalInfo?.email || "",
            phone: parsedData.personalInfo?.phone || "", // Updated this line
            category: parsedData.personalInfo?.category || "",
            religion: parsedData.personalInfo?.religion || "",
          },
          education: {
            graduationDegree: parsedData.education?.graduationDegree || "",
            graduationUniversity:
              parsedData.education?.graduationUniversity || "",
            graduationYear: parsedData.education?.graduationYear || "",
            tenthMarks: parsedData.education?.tenthMarks || "",
            twelfthMarks: parsedData.education?.twelfthMarks || "",
            tenthBoardMarks: {
              marks: parsedData.education?.tenthBoardMarks?.marks || "",
              percentage:
                parsedData.education?.tenthBoardMarks?.percentage || "",
            },
          },
          familyInfo: {
            fatherProfession: parsedData.familyInfo?.fatherProfession || "",
            motherProfession: parsedData.familyInfo?.motherProfession || "",
            parentsAnnualIncome:
              parsedData.familyInfo?.parentsAnnualIncome || "",
          },
          workExperience: parsedData.workExperience || [],
          futureGoals: {
            fiveYearVision: parsedData.futureGoals?.fiveYearVision || "",
          },
          interests: {
            hobbies: parsedData.interests?.hobbies || [],
          },
          professionalInfo: {
            postAppliedFor: parsedData.professionalInfo?.postAppliedFor || "",
          },
          situationalJudgment: {
            lateWorkScenario:
              parsedData.situationalJudgment?.lateWorkScenario || "",
          },
          additionalInfo: {
            otherInformation: parsedData.additionalInfo?.otherInformation || "",
          },
        });
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

  const handleSubmit = async () => {
    try {
      const response = await axios.put("http://localhost:5000/profile", profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Graduation Degree"
                  value={profileData.education.graduationDegree || ""}
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
                  fullWidth
                  label="Graduation University"
                  value={profileData.education.graduationUniversity || ""}
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "graduationUniversity",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  value={profileData.education.graduationYear || ""}
                  onChange={(e) =>
                    handleChange("education", "graduationYear", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tenth Marks"
                  value={profileData.education.tenthMarks || ""}
                  onChange={(e) => {
                    const marks = e.target.value;
                    // Update both tenthMarks and tenthBoardMarks.marks
                    handleChange("education", "tenthMarks", marks);
                    handleChange("education", "tenthBoardMarks", {
                      ...profileData.education.tenthBoardMarks,
                      marks: marks,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twelfth Marks"
                  value={profileData.education.twelfthMarks || ""}
                  onChange={(e) =>
                    handleChange("education", "twelfthMarks", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Tenth Board Marks</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Marks"
                      value={profileData.education.tenthBoardMarks?.marks || ""}
                      onChange={(e) =>
                        handleChange("education", "tenthBoardMarks", {
                          ...profileData.education.tenthBoardMarks,
                          marks: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Percentage"
                      value={
                        profileData.education.tenthBoardMarks?.percentage || ""
                      }
                      onChange={(e) =>
                        handleChange("education", "tenthBoardMarks", {
                          ...profileData.education.tenthBoardMarks,
                          percentage: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
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
                    fullWidth
                    label={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
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

        {/* Additional Info Section */}
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

        {/* Future Goals Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Future Goals
            </Typography>
            <TextField
              fullWidth
              label="Five Year Vision"
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
              label="Hobbies (comma separated)"
              value={profileData.interests.hobbies.join(", ")}
              onChange={(e) => {
                const hobbies = e.target.value
                  .split(",")
                  .map((hobby) => hobby.trim());
                handleChange("interests", "hobbies", hobbies);
              }}
            />
          </Paper>
        </Grid>

        {/* Professional Info Section */}
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
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Save Profile
        </Button>
      </Box>
    </Container>
  );
};

export default ProfileCompletion;

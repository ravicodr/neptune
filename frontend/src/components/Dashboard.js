import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Person,
  School,
  Work,
  AttachMoney,
  Psychology,
  Phone,
  Home,
  PlayArrow,
  CheckCircle,
  Pending,
  Cancel,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response);

        let data = await response.data;
        console.log("Student data:", data);
        data = data?.profile;

        // Transforming data to match your component's structure
        setStudentData({
          name: data?.personalInfo?.name || "Name not provided",
          email: data?.personalInfo?.emailId || "Email not provided",
          applicationStatus: "Under Review", // Assuming this will come from your API
          personalInfo: {
            number:
              data?.personalInfo?.number[0] ||
              "Phone number not provided",
            address: "Address not provided", // Static value; can be enhanced
          },
          education: {
            graduationDegree:
              data?.education?.graduationDegree || "Degree not provided",
            tenthMarks:
              data?.education?.tenthBoardMarks?.percentage ||
              "Marks not provided",
          },
          parentInfo: {
            income:
              data?.familyInfo?.parentsAnnualIncome || "Income not provided",
            occupation: (() => {
              const fatherProfession = data?.familyInfo?.fathersProfession;
              const motherProfession = data?.familyInfo?.mothersProfession;
              if (fatherProfession && motherProfession) {
                return `${fatherProfession} & ${motherProfession}`;
              } else if (fatherProfession) {
                return fatherProfession;
              } else if (motherProfession) {
                return motherProfession;
              } else {
                return "Occupation not provided";
              }
            })(),
          },
          iqEqTest: {
            completed: true, // Assuming this will come from your API
            score: 75, // Assuming a static value or derive it from the API
          },
          notifications: [
            response.data.tasks["Uploading CV"]
              ? "CV uploaded successfully"
              : "CV not uploaded",
            response.data.tasks["Completing the Profile"]
              ? "Resume uploaded successfully"
              : "Resume not uploaded",
            response.data.tasks["Starting the EQ test"]
              ? "EQ test started successfully"
              : "EQ test not started",
            response.data.tasks["Submit EQ test"]
              ? "EQ test submitted successfully"
              : "EQ test not submitted",
          ],
          interviewSubmitted: response.data.tasks["Start Interview"], // Add this line to track interview submission
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token]);

  const handleStartInterview = () => {
    navigate("/virtual-interview");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle color="success" />;
      case "Under Review":
        return <Pending color="warning" />;
      case "Rejected":
        return <Cancel color="error" />;
      default:
        return <Pending color="info" />;
    }
  };

  const calculateProfileCompletion = (data) => {
    const totalFields = 9; // Updated based on the relevant fields
    const filledFields = [
      data?.personalInfo.name,
      data?.personalInfo.email,
      data?.personalInfo.phone,
      data?.education.graduationDegree,
      data?.education.tenthMarks,
      data?.parentInfo.income,
      data?.parentInfo.occupation,
      data?.iqEqTest.completed,
      data?.notifications.length > 0, // At least one notification
    ].filter(Boolean).length;

    return (filledFields / totalFields) * 100;
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!studentData) {
    return <Typography>Error loading student data.</Typography>;
  }

  const profileCompletion = calculateProfileCompletion(studentData);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" component="div" sx={{ mr: 2 }}>
          Application Status:
        </Typography>
        <Chip
          icon={getStatusIcon(studentData.applicationStatus)}
          label={studentData.applicationStatus}
          color="primary"
          size="large"
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h5">{studentData.name}</Typography>
            <Typography color="textSecondary">{studentData.email}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={profileCompletion}
              sx={{ height: 10, borderRadius: 5, mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(profileCompletion)}% Complete`}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<Person />}
            >
              Complete Profile
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={studentData.personalInfo.phone}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={studentData.personalInfo.address}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText
                  primary="Graduation Degree"
                  secondary={studentData.education.graduationDegree}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Psychology />
                </ListItemIcon>
                <ListItemText
                  primary="10th Marks"
                  secondary={`${studentData.education.tenthMarks}%`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parent Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText
                  primary="Annual Income"
                  secondary={`₹${parseInt(
                    studentData.parentInfo.income
                  ).toLocaleString()}`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Work />
                </ListItemIcon>
                <ListItemText
                  primary="Occupation"
                  secondary={studentData.parentInfo.occupation}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interview Status
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<PlayArrow />}
              onClick={handleStartInterview}
              disabled={studentData.interviewSubmitted} // Disable button if already submitted
            >
              Start Interview
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              {studentData.notifications.map((notification, index) => (
                <ListItem key={index}>
                  <ListItemText primary={notification} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;

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
  Avatar,
} from "@mui/material";
import {
  Person,
  School,
  Work,
  AttachMoney,
  Psychology,
  Phone,
  PlayArrow,
  CheckCircle,
  Pending,
  Cancel,
  Email,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token,user,tasks,setTasks,setUser } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.profile)
        setTasks(response.data.tasks);
        // const data = response.user?.user;
        // const otherInfo = response.data;

        setStudentData({
          name: user?.personalInfo?.name || "Name not provided",
          email: user?.personalInfo?.emailId || "Email not provided",
          applicationStatus: user?.interviews?.rejectionReason
            ? user?.interviews?.rejectionReason
            : tasks["Submit EQ test"]
            ? "Approved"
            : "Pending",
          personalInfo: {
            mobileNumber:
              user?.personalInfo?.mobileNumber || "Phone number not provided",
            emailId: user?.personalInfo?.emailId || "Email Id not provided",
          },
          education: {
            graduationDegree:
              user?.education?.graduationDegree || "Degree not provided",
            tenthMarks:
              user?.education?.tenthBoardMarks?.percentage ||
              "Marks not provided",
          },
          parentInfo: {
            income:
              user?.familyInfo?.parentsAnnualIncome || "Income not provided",
            occupation: (() => {
              const fatherProfession = user?.familyInfo?.fathersProfession;
              const motherProfession = user?.familyInfo?.mothersProfession;
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
          notifications: [
            tasks["Uploading CV"]
              ? "CV uploaded successfully"
              : "CV not uploaded",
            tasks["Completing the Profile"]
              ? "Profile completed successfully"
              : "Profile not completed",
            tasks["Starting the EQ test"]
              ? "EQ test started successfully"
              : "EQ test not started",
            tasks["Submit EQ test"]
              ? "EQ test submitted successfully"
              : "EQ test not submitted",
          ],
          interviewSubmitted: tasks["Submit EQ test"],
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token, tasks]);

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
    const totalFields = 2;
    const filledFields = [
      user?.personalInfo.name,
      user?.personalInfo.emailId,
      user?.personalInfo.mobileNumber,
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}>
                <Person fontSize="large" />
              </Avatar>
              <Typography variant="h5">{studentData.name}</Typography>
              <Typography color="textSecondary">{studentData.email}</Typography>
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
                    secondary={studentData.personalInfo.mobileNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={studentData.personalInfo.emailId}
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

          <Grid item xs={12}>
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
                disabled={studentData.interviewSubmitted}
              >
                Start Interview
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
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
      </Paper>
    </Container>
  );
};

export default StudentDashboard;

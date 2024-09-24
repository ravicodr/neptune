import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Person,
  School,
  Work,
  AttachMoney,
  Psychology,
  Notifications,
  Phone,
  Home,
  EventNote,
  PlayArrow,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating an API call to fetch student data
    setTimeout(() => {
      setStudentData({
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.jpg", // Replace with actual avatar URL
        applicationStatus: "Under Review",
        profileCompletion: 80,
        personalInfo: {
          phone: "+1234567890",
          address: "123 Main St, Anytown, USA"
        },
        education: {
          itiTrade: "Electronics",
          tenthMarks: 85
        },
        parentInfo: {
          income: 1200000,
          occupation: "Engineer"
        },
        interviewStatus: {
          scheduled: true,
          date: "2023-06-15",
          time: "10:00 AM"
        },
        iqEqTest: {
          completed: true,
          score: 75
        },
        notifications: [
          "Your application has been received and is under review.",
          "Please complete your IQ/EQ test before the interview.",
          "Interview scheduled for June 15, 2023 at 10:00 AM."
        ]
      });
      setLoading(false);
    }, 1000); // Simulating a 1-second delay
  }, []);

  const handleStartInterview = () => {
    navigate('/virtualInterview');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle color="success" />;
      case 'Under Review':
        return <Pending color="warning" />;
      case 'Rejected':
        return <Cancel color="error" />;
      default:
        return <Pending color="info" />;
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!studentData) {
    return <Typography>Error loading student data.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={studentData.avatar}
              sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
            >
              {studentData.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">{studentData.name}</Typography>
            <Typography color="textSecondary">{studentData.email}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Profile Completion</Typography>
            <LinearProgress 
              variant="determinate" 
              value={studentData.profileCompletion} 
              sx={{ height: 10, borderRadius: 5, mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              {`${studentData.profileCompletion}% Complete`}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} startIcon={<Person />}>
              Complete Profile
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="Phone" secondary={studentData.personalInfo.phone} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Address" secondary={studentData.personalInfo.address} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Education</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary="ITI Trade" secondary={studentData.education.itiTrade} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Psychology />
                </ListItemIcon>
                <ListItemText primary="10th Marks" secondary={`${studentData.education.tenthMarks}%`} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Parent Information</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText primary="Annual Income" secondary={`₹${studentData.parentInfo.income.toLocaleString()}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Work />
                </ListItemIcon>
                <ListItemText primary="Occupation" secondary={studentData.parentInfo.occupation} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Interview Status</Typography>
            {studentData.interviewStatus.scheduled ? (
              <>
                <Typography variant="body1">Your interview is scheduled for:</Typography>
                <Typography variant="h5" color="primary">{`${studentData.interviewStatus.date} at ${studentData.interviewStatus.time}`}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  startIcon={<PlayArrow />}
                  onClick={handleStartInterview}
                >
                  Start Interview
                </Button>
              </>
            ) : (
              <Typography variant="body1">Your interview has not been scheduled yet.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            <List>
              {studentData.notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={notification} />
                  </ListItem>
                  {index < studentData.notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
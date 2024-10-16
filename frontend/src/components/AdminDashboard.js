import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Description, CheckCircle, Group } from "@mui/icons-material";
import api from "../api"; // Adjust the import based on your project structure

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    cvsGenerated: 0,
    cvsSelected: 0,
    interviewsSelected: 0,
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateAddress: "",
    city: "",
    state: "",
    zipCode: "",
    companyName: "",
    departmentName: "",
    supervisorName: "",
    startDate: "",
    startTime: "",
    endTime: "",
    daysOfWeek: "",
    acceptanceDeadlineDate: "",
    yourName: "",
    yourPosition: "",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await api.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        console.log("Dashboard data:", response.data);

        setStats(response.data.stats);

        const students = response.data.students.map((student) => ({
          id: student._id.$oid,
          name: student.profile.personalInfo.name || "",
          email: student.profile.personalInfo.emailId || "",
          itiTrade: student.profile.education.graduationDegree || "",
          parentIncome: student.profile.familyInfo.parentsAnnualIncome || "",
          parentOccupation: `${
            student.profile.familyInfo.fathersProfession || ""
          }, ${student.profile.familyInfo.mothersProfession || ""}`,
          iqEqWrongAnswers: "",
          tenthMarks:
            student.profile.education.tenthBoardMarks.percentage || "",
          status: student.interviews.approved ? "Approved" : "",
          comment: student.interviews.comment || "",
        }));

        setSelectedStudents(students);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleApprove = (id) => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = async () => {
    // Implement the API call to approve the student with form data
    console.log(formData);
    setOpenDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCommentChange = (id, comment) => {
    setSelectedStudents((students) =>
      students.map((student) =>
        student.id === id ? { ...student, comment } : student
      )
    );
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          bgcolor: "white",
          color: "black",
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ bgcolor: "white", color: "black", padding: 3 }}
    >
      <Typography variant="h4" sx={{ mt: 4, mb: 2, color: "orange" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#f9f9f9",
            }}
          >
            <Box>
              <Typography variant="h6">CVs Generated</Typography>
              <Typography variant="h4">{stats.cvsGenerated}</Typography>
            </Box>
            <Description fontSize="large" sx={{ color: "green" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#f9f9f9",
            }}
          >
            <Box>
              <Typography variant="h6">CVs Selected</Typography>
              <Typography variant="h4">{stats.cvsSelected}</Typography>
            </Box>
            <CheckCircle fontSize="large" sx={{ color: "green" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#f9f9f9",
            }}
          >
            <Box>
              <Typography variant="h6">Interviews Selected</Typography>
              <Typography variant="h4">{stats.interviewsSelected}</Typography>
            </Box>
            <Group fontSize="large" sx={{ color: "green" }} />
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "orange" }}>
        Selected Students This Week
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>ITI Trade</TableCell>
              <TableCell>Parent Income</TableCell>
              <TableCell>Parent Occupation</TableCell>
              <TableCell>IQ/EQ Wrong Answers</TableCell>
              <TableCell>10th Marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.itiTrade}</TableCell>
                <TableCell>{student.parentIncome}</TableCell>
                <TableCell>{student.parentOccupation}</TableCell>
                <TableCell>{student.iqEqWrongAnswers}</TableCell>
                <TableCell>{student.tenthMarks}%</TableCell>
                <TableCell>{student.status}</TableCell>
                <TableCell>
                  <TextField
                    value={student.comment}
                    disabled={student.status === "Approved"}
                    onChange={(e) =>
                      handleCommentChange(student.id, e.target.value)
                    }
                    multiline
                    rows={2}
                    sx={{
                      bgcolor: "#f9f9f9",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "lightgray",
                        },
                        "&:hover fieldset": {
                          borderColor: "green",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "green",
                        },
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  {student.status === "Approved" ? (
                    <Typography variant="body2" sx={{ color: "green" }}>
                      Approved
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "orange",
                        "&:hover": { bgcolor: "#ff8c00" },
                        color: "white",
                      }}
                      onClick={() => handleApprove(student.id)}
                      disabled={student.status === "Approved"}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Approve Student</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="candidateName"
            label="Candidate's Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.candidateName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="candidateAddress"
            label="Candidate's Address"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.candidateAddress}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.city}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.state}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="zipCode"
            label="Zip Code"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.zipCode}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="companyName"
            label="Company Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.companyName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="departmentName"
            label="Department Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.departmentName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="supervisorName"
            label="Supervisor/Manager's Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.supervisorName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="startTime"
            label="Start Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.startTime}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="endTime"
            label="End Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.endTime}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="daysOfWeek"
            label="Days of the Week"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.daysOfWeek}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="acceptanceDeadlineDate"
            label="Acceptance Deadline Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.acceptanceDeadlineDate}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="yourName"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.yourName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="yourPosition"
            label="Your Position"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.yourPosition}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDialogSubmit}
            variant="contained"
            color="primary"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;

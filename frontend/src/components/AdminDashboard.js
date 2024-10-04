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
  CircularProgress, // Import CircularProgress for loading spinner
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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Set loading to true when fetching starts
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
          status: student.interviews.approved ? "Approved" : "", // Assuming 'approved' is a boolean
          comment: student.interviews.comment || "", // Initialize with existing comment if available
        }));

        setSelectedStudents(students);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const student = selectedStudents.find((student) => student.id === id);
      const response = await api.post(
        `/admin/approve-student/${id}`,
        {
          comment: student.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setSelectedStudents((students) =>
          students.map((student) =>
            student.id === id ? { ...student, status: "Approved" } : student
          )
        );
      } else {
        console.error("Failed to approve student:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const handleCommentChange = (id, comment) => {
    setSelectedStudents((students) =>
      students.map((student) =>
        student.id === id ? { ...student, comment } : student
      )
    );
  };

  if (loading) {
    // Show spinner while loading
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
                    disabled={student.status === "Approved"} // Disable if approved
                    onChange={(e) =>
                      handleCommentChange(student.id, e.target.value)
                    }
                    multiline
                    rows={2}
                    sx={{
                      bgcolor: "#f9f9f9",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "lightgray", // Default border color
                        },
                        "&:hover fieldset": {
                          borderColor: "green", // Border color on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "green", // Border color when focused
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
    </Container>
  );
};

export default AdminDashboard;

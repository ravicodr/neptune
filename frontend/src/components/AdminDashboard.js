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

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      console.log("Dashboard data:", response.data);

      const students = response.data.map((student) => ({
        id: student._id.$oid,
        name: student.profile.personalInfo.name || "",
        email: student.profile.personalInfo.emailId || "",
        itiTrade: student.profile.education.graduationDegree || "",
        parentIncome: student.profile.familyInfo.parentsAnnualIncome || "",
        parentOccupation: `${
          student.profile.familyInfo.fathersProfession || ""
        }, ${student.profile.familyInfo.mothersProfession || ""}`,
        iqEqWrongAnswers: "",
        tenthMarks: student.profile.education.tenthBoardMarks.percentage || "",
        status: "",
        comment: "",
      }));

      setSelectedStudents(students);
    }

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const student = selectedStudents.find((student) => student.id === id);
      const response = await api.post(
        `/admin/approve-student/${id}`,
        {
          iq_eq_wrong_answers: student.iqEqWrongAnswers,
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
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
            }}
          >
            <Box>
              <Typography variant="h6">CVs Generated</Typography>
              <Typography variant="h4">{stats.cvsGenerated}</Typography>
            </Box>
            <Description fontSize="large" color="primary" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6">CVs Selected</Typography>
              <Typography variant="h4">{stats.cvsSelected}</Typography>
            </Box>
            <CheckCircle fontSize="large" color="primary" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6">Interviews Selected</Typography>
              <Typography variant="h4">{stats.interviewsSelected}</Typography>
            </Box>
            <Group fontSize="large" color="primary" />
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
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
                    onChange={(e) =>
                      handleCommentChange(student.id, e.target.value)
                    }
                    multiline
                    rows={2}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(student.id)}
                    disabled={student.status === "Approved"}
                  >
                    {student.status === "Approved" ? "Approved" : "Approve"}
                  </Button>
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

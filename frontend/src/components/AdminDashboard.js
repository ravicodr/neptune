import React, { useState, useEffect } from 'react';
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
  TextField
} from '@mui/material';
import {
  Description,
  CheckCircle,
  Group
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    cvsGenerated: 0,
    cvsSelected: 0,
    interviewsSelected: 0
  });

  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch stats and selected students data
    // This is where you'd typically make API calls
    setStats({
      cvsGenerated: 100,
      cvsSelected: 50,
      interviewsSelected: 25
    });

    setSelectedStudents([
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        itiTrade: 'Computer Science',
        parentIncome: 1000000,
        parentOccupation: 'Engineer',
        iqEqWrongAnswers: 1,
        tenthMarks: 85,
        status: 'Pending', 
        comment: '' 
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        itiTrade: 'Electronics',
        parentIncome: 2000000,
        parentOccupation: 'IAS',
        iqEqWrongAnswers: 3,
        tenthMarks: 75,
        status: 'Approved', 
        comment: 'Great candidate' 
      },
      // Add more students as needed
    ]);
  }, []);

  const handleApprove = (id) => {
    setSelectedStudents(students =>
      students.map(student =>
        student.id === id ? { ...student, status: 'Approved' } : student
      )
    );
  };

  const handleCommentChange = (id, comment) => {
    setSelectedStudents(students =>
      students.map(student =>
        student.id === id ? { ...student, comment } : student
      )
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">CVs Generated</Typography>
              <Typography variant="h4">{stats.cvsGenerated}</Typography>
            </Box>
            <Description fontSize="large" color="primary" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">CVs Selected</Typography>
              <Typography variant="h4">{stats.cvsSelected}</Typography>
            </Box>
            <CheckCircle fontSize="large" color="primary" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">Interviews Selected</Typography>
              <Typography variant="h4">{stats.interviewsSelected}</Typography>
            </Box>
            <Group fontSize="large" color="primary" />
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Selected Students This Week</Typography>

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
                    onChange={(e) => handleCommentChange(student.id, e.target.value)}
                    multiline
                    rows={2}
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleApprove(student.id)}
                    disabled={student.status === 'Approved'}
                  >
                    {student.status === 'Approved' ? 'Approved' : 'Approve'}
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
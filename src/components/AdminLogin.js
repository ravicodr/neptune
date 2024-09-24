import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Typography, 
  Box,
  Container,
  Paper
} from '@mui/material';

const AdminLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Here you would typically validate the admin credentials
    // For this example, we'll use a simple check
    if (userId === 'admin' && password === 'password') {
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/adminDashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userId"
            label="User ID"
            name="userId"
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Admin Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
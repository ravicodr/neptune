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
import api from "../api"

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async(e) => {
    e.preventDefault();
    // Here you would typically validate the admin credentials
    // For this example, we'll use a simple check
    const response = await api.post('/admin/login', { email, password });
    console.log("Login result:", response);
    
    if (response) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem("adminToken", response.data.access_token);
      navigate('/admin-dashboard');
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
            id="email"
            label="Email ID"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Typography, 
  Box,
  Container,
  Paper,
  Link as MuiLink
} from '@mui/material';

const Login = ({ setIsAuthenticated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Your login logic here
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            autoFocus
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              {"Don't have an account? Sign Up"}
            </Link>
            <MuiLink component={Link} to="/adminLogin" variant="body2">
              Admin Login
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
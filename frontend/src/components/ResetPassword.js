import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Typography, 
  Box,
  Avatar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ResetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = ['Enter Phone Number', 'Verify OTP', 'Set New Password'];

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.trim() === '') {
      alert('Please enter a phone number');
      return;
    }
    console.log('Sending OTP to', phoneNumber);
    setActiveStep(1);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.trim() === '') {
      alert('Please enter the OTP');
      return;
    }
    // Any non-empty OTP is accepted
    console.log('Verifying OTP', otp);
    setActiveStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      alert('Please enter and confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log('Resetting password for', phoneNumber);
    alert('Password reset successfully');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box component="form" onSubmit={activeStep === 0 ? handleSendOtp : activeStep === 1 ? handleVerifyOtp : handleResetPassword} noValidate sx={{ mt: 3 }}>
        {activeStep === 0 && (
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
        )}
        {activeStep === 1 && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="OTP"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        {activeStep === 2 && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {activeStep === 0 ? 'Send OTP' : activeStep === 1 ? 'Verify OTP' : 'Reset Password'}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
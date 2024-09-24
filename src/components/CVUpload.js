import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Typography, 
  Box,
  Container,
  Alert,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Dummy API response
const dummyApiResponse = {
  personalInfo: {
    name: "Amarjeet Kumar",
    mobileNumber: "8271713306",
    emailId: "amarjeetk504@gmail.com",
    category: null,
    religion: null
  },
  education: {
    tenthBoardMarks: {
      marks: "53.4",
      percentage: "53.4%"
    }
  },
  professionalInfo: {
    postAppliedFor: null
  },
  familyInfo: {
    parentsAnnualIncome: null
  },
  interests: {
    hobbies: ["Playing Cricket", "Carrom", "Badminton"]
  },
  futureGoals: {
    fiveYearVision: null
  },
  additionalInfo: {
    otherInformation: null
  },
  situationalJudgment: {
    lateWorkScenario: null
  }
};

const CVUpload = ({ setIsFirstTimeUser }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);

    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the dummy response in localStorage
      localStorage.setItem('profileData', JSON.stringify(dummyApiResponse));

      setIsFirstTimeUser(false);
      navigate('/profile-completion');
    } catch (error) {
      console.error('Error uploading CV:', error);
      setError('Error uploading CV. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Upload CV
        </Typography>
        <Box component="form" onSubmit={handleUpload} noValidate sx={{ mt: 1 }}>
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Select CV File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!file || uploading}
          >
            Upload CV
          </Button>
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Box>
    </Container>
  );
};

export default CVUpload;
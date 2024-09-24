import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Timer, NavigateNext, Check } from '@mui/icons-material';

const questions = [
  {
    question: "Describe a time when you received constructive criticism. How did you respond?",
    options: [
      "I listened carefully to the feedback, thanked my colleague for their honesty, and made specific plans to improve my performance based on their suggestions.",
      "I acknowledged the feedback and tried to implement some changes, but I struggled to fully adjust my approach.",
      "I felt upset and defensive initially, but I didn't approach the person again about it."
    ]
  },
  {
    question: "Can you share an example of how you handled a stressful situation at work?",
    options: [
      "I maintained my composure, prioritized my tasks, and sought support from my team while also communicating openly about the challenges we faced.",
      "I managed to get through the stressful situation but found myself feeling quite overwhelmed at times.",
      "I just focused on my work and hoped that it would resolve itself without much input from me."
    ]
  },
  // Add more questions here...
];

const QUESTION_TIME = 30; // 30 seconds per question

const VirtualInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answers, setAnswers] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          handleNextQuestion();
          return QUESTION_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    setAnswers([...answers, selectedAnswer]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(QUESTION_TIME);
    } else {
      setIsInterviewComplete(true);
    }
  };

  const handleSubmitInterview = () => {
    // Here you would typically send the answers to your backend
    console.log('Interview answers:', answers);
    navigate('/dashboard'); // Navigate back to dashboard after submission
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Virtual Interview
        </Typography>
        {!isInterviewComplete ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Timer color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Time Left: {timeLeft} seconds
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(timeLeft / QUESTION_TIME) * 100} 
              sx={{ mb: 2, height: 10, borderRadius: 5 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 2 }}>
                <Typography variant="h6">{questions[currentQuestionIndex].question}</Typography>
              </FormLabel>
              <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <FormControlLabel 
                    key={index} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                endIcon={<NavigateNext />}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
              </Button>
            </Box>
          </>
        ) : (
          <Dialog
            open={isInterviewComplete}
            onClose={handleSubmitInterview}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Interview Complete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You have completed all questions. Are you ready to submit your interview?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmitInterview} color="primary" autoFocus startIcon={<Check />}>
                Submit Interview
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </Container>
  );
};

export default VirtualInterview;
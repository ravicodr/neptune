import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Timer, NavigateNext, Check } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const QUESTION_TIME = 30; // 30 seconds per question

const VirtualInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answers, setAnswers] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewId, setInterviewId] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  // Start the interview and get the interview ID
  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/start-virtual-interview",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'stream',
        }
      );

      const reader = response.data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", chunk);

        try {
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk.interviewId) {
            setInterviewId(parsedChunk.interviewId);
            break;
          }
        } catch (error) {
          console.error("Error parsing chunk:", error);
        }
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions based on the interview ID
  const fetchQuestions = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/interview-questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit the interview answers
  const handleSubmitInterview = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        `/submit-interview/${interviewId}`,
        {
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Your total score is: ${response.data.total_score}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting interview:", error);
      alert("Failed to submit interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeInterview = async () => {
      await startInterview();
    };

    initializeInterview();
  }, []);

  useEffect(() => {
    if (interviewId) {
      fetchQuestions(interviewId);
    }
  }, [interviewId]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (currentQuestionIndex < questions.length - 1) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestionIndex, questions.length]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === "") {
      alert("Please select an answer before proceeding.");
      return;
    }

    setAnswers((prevAnswers) => [...prevAnswers, selectedAnswer]);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(QUESTION_TIME); // Reset the timer for the next question
    } else {
      setIsInterviewComplete(true);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Virtual Interview
        </Typography>
        {!isInterviewComplete && questions.length > 0 ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel component="legend" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {questions[currentQuestionIndex].question}
                </Typography>
              </FormLabel>
              <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                {questions[currentQuestionIndex].answers.map(
                  (answer, index) => (
                    <FormControlLabel
                      key={index}
                      value={answer}
                      control={<Radio />}
                      label={answer}
                      sx={{ mb: 1 }}
                    />
                  )
                )}
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                endIcon={<NavigateNext />}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next Question"}
              </Button>
            </Box>
          </>
        ) : (
          <Dialog
            open={isInterviewComplete}
            onClose={() => setIsInterviewComplete(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Interview Complete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You have completed all questions. Are you ready to submit your
                interview?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleSubmitInterview}
                color="primary"
                autoFocus
                startIcon={<Check />}
              >
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
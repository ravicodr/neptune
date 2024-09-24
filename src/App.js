import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import CVUpload from "./components/CVUpload";
import ProfileCompletion from "./components/ProfileCompletion";
import VirtualInterview from "./components/VirtualInterview";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const theme = createTheme({
  // Your theme configuration
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                isFirstTimeUser ? (
                  <Navigate to="/cv-upload" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setIsFirstTimeUser={setIsFirstTimeUser}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                setIsAuthenticated={setIsAuthenticated}
                setIsFirstTimeUser={setIsFirstTimeUser}
              />
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/cv-upload"
            element={
              isAuthenticated ? (
                <CVUpload setIsFirstTimeUser={setIsFirstTimeUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile-completion"
            element={
              isAuthenticated ? <ProfileCompletion /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/virtualInterview"
            element={
              isAuthenticated ? <VirtualInterview /> : <Navigate to="/login" />
            }
          />
          <Route path="/adminLogin" element={<AdminLogin />} />

          <Route
            path="/adminDashboard"
            element={
              localStorage.getItem("adminAuthenticated") === "true" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/adminLogin" />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

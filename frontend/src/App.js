import React from "react";
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
import { useAuth } from "./contexts/AuthContext";

const theme = createTheme({
  // Your theme configuration
});
console.log("Current environment:", process.env.REACT_APP_NODE_ENV);
console.log("Current Dev environment", process.env.REACT_APP_API_BASE_URL_DEV);
console.log(
  "Current Prod environment:",
  process.env.REACT_APP_API_BASE_URL_PROD
);

function App() {
  const { tasks, token } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                tasks?.["Uploading CV"] ? (
                  tasks?.["Completing the Profile"] ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/profile-completion" />
                  )
                ) : (
                  <Navigate to="/cv-upload" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/cv-upload"
            state={{}}
            element={token ? <CVUpload /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile-completion"
            element={token ? <ProfileCompletion /> : <Navigate to="/login" />}
          />
          <Route
            path="/virtual-interview"
            element={token ? <VirtualInterview /> : <Navigate to="/login" />}
          />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

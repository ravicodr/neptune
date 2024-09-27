import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../api"; // Make sure to import the apiService you created
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to sign up a new user
  const signup = async (phone, password) => {
    setError(null); // Clear previous errors
    try {
      const response = await apiService.signup({ phone, password });

      return response; // Return response for further use if needed
    } catch (err) {
      setError(err.message || "Something went wrong during signup");
      return null; // Ensure null is returned on error
    }
  };

  // Function to log in a user
  const login = async (phone, password) => {
    setError(null); // Clear previous errors
    try {
      const response = await apiService.login(phone, password);
      console.log("Login response:", response);
      
      setToken(response.access_token); // Set token
      const profile = await axios.get(
        "http://localhost:5000/profile",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      )

      setUser(profile.data.profile);
      return response; // Return response for further use if needed
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  

  return (
    <AuthContext.Provider
      value={{ user, setUser, signup, login, logout, loading, error, token,tasks }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

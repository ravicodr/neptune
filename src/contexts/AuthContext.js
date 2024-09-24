import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../api"; // Make sure to import the apiService you created

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to sign up a new user
  const signup = async (phone, password) => {
    setError(null); // Clear previous errors
    try {
      const response = await apiService.signup({ phone, password });
      setUser(response.user); // Set user data
      localStorage.setItem("token", response.access_token); // Store token
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
      
      setUser(response.user); // Set user data
      localStorage.setItem("token", response.access_token); // Store token in localStorage
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

  // Check for user on initial load (e.g., from localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService
        .getProfile()
        .then((response) => {
          setUser(response.profile); // Set user from profile data
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, loading, error }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

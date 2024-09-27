// src/api.js
import axios from "axios";


const API_BASE_URL = "http://localhost:5000"; // Replace with your actual API base URL

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 15000, // Set a timeout for requests
});



// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part of the response
  },
  (error) => {
    // Handle response error
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data); // Return the error response
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return Promise.reject({ message: "No response received from server" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Define API functions
export const apiService = {
  signup: (data) => api.post("/signup", data), // Signup API
  login: (phone, password) => api.post("/login", { phone, password }),
 
  updateProfile: (data) => api.put("/profile", data), // Update profile API
  uploadFile: (formData) =>
    api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }), // Upload file API
  // Add more API methods as needed
};

export default api;

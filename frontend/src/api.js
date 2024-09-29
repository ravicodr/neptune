// src/utils/api.js
import axios from "axios";

// Determine the base URL based on the environment
const baseURL =
  process.env.REACT_APP_NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : process.env.REACT_APP_API_BASE_URL_PROD;

// Create an instance of axios with the determined base URL
const api = axios.create({
  baseURL,
});

export default api;

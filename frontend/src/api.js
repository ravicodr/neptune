// src/utils/api.js
import axios from "axios";

// Determine the base URL based on the environment
// const baseURL =
//   process.env.REACT_APP_NODE_ENV === "development"
//     ? process.env.REACT_APP_API_BASE_URL_DEV
//     : process.env.REACT_APP_API_BASE_URL_PROD;

// const baseURL = '';
// const REACT_APP_API_BASE_URL_DEV = window.location.hostname + "/api";
// console.log(window.location.hostname);

// const baseURL = REACT_APP_API_BASE_URL_DEV;
const baseURL = "http://localhost:5000"
// Create an instance of axios with the determined base URL
const api = axios.create({
  baseURL,
});

export default api;

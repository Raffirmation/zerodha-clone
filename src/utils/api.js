import axios from "axios";

// withCredentials lets the browser send/receive the httpOnly JWT cookie
// set by the backend, so we don't have to manage the token manually.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

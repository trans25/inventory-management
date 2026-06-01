import axios from "axios";

export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// axios instance that sends the HTTP-only auth cookie with every request
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;

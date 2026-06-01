import api from "./api";
import {
  mockLogin,
  mockRegister,
  mockLogout,
  mockGetLoginStatus,
  mockGetUser,
} from "./mockAuth";

// TEMPORARY: when true, auth uses in-browser dummy users instead of the backend.
// Flip to false (or set REACT_APP_USE_MOCK_AUTH=false) once the real backend is up.
const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH !== "false";

// register a new user
export const registerUser = async (userData) => {
  if (USE_MOCK_AUTH) return mockRegister(userData);
  const response = await api.post("/users/register", userData);
  return response.data;
};

// login user
export const loginUser = async (userData) => {
  if (USE_MOCK_AUTH) return mockLogin(userData);
  const response = await api.post("/users/login", userData);
  return response.data;
};

// logout user
export const logoutUser = async () => {
  if (USE_MOCK_AUTH) return mockLogout();
  const response = await api.get("/users/logout");
  return response.data;
};

// get login status (true/false)
export const getLoginStatus = async () => {
  if (USE_MOCK_AUTH) return mockGetLoginStatus();
  const response = await api.get("/users/loginStatus");
  return response.data;
};

// get current user profile
export const getUser = async () => {
  if (USE_MOCK_AUTH) return mockGetUser();
  const response = await api.get("/users/getUser");
  return response.data;
};

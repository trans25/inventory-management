// TEMPORARY mock authentication layer.
// Lets you explore the UI with dummy users while the PostgreSQL database/backend
// is being set up. Remove this file (and the USE_MOCK_AUTH branch in authService.js)
// once the real backend is running.

const STORAGE_KEY = "mockAuthUser";

// dummy accounts — one per role. password is the same for convenience.
const DUMMY_USERS = [
  {
    _id: "mock-admin-1",
    name: "Ada Admin",
    email: "admin@demo.com",
    password: "password",
    role: "admin",
    image: "no image",
    phone: "+27",
    bio: "Demo admin account",
  },
  {
    _id: "mock-manager-1",
    name: "Max Manager",
    email: "manager@demo.com",
    password: "password",
    role: "manager",
    image: "no image",
    phone: "+27",
    bio: "Demo manager account",
  },
  {
    _id: "mock-shop-1",
    name: "Sam Shop",
    email: "shop@demo.com",
    password: "password",
    role: "shop",
    image: "no image",
    phone: "+27",
    bio: "Demo shop account",
  },
];

const stripPassword = ({ password, ...rest }) => rest;

export const mockLogin = async ({ email, password }) => {
  const match = DUMMY_USERS.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!match || match.password !== password) {
    const error = new Error("Invalid email or password");
    error.response = { data: { message: "Invalid email or password" } };
    throw error;
  }
  const user = stripPassword(match);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const mockRegister = async (userData) => {
  // pretend registration succeeds and logs the new user in as a "shop" role
  const user = {
    _id: `mock-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: "shop",
    image: "no image",
    phone: "+27",
    bio: "bio",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const mockLogout = async () => {
  localStorage.removeItem(STORAGE_KEY);
  return { message: "successfully logged out" };
};

export const mockGetLoginStatus = async () => {
  return Boolean(localStorage.getItem(STORAGE_KEY));
};

export const mockGetUser = async () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const error = new Error("User not found");
    error.response = { data: { message: "User not found" } };
    throw error;
  }
  return JSON.parse(raw);
};

export const DUMMY_CREDENTIALS = DUMMY_USERS.map(({ email, role }) => ({
  email,
  password: "password",
  role,
}));

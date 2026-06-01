import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getLoginStatus,
  getUser,
  loginUser as loginRequest,
  logoutUser as logoutRequest,
  registerUser as registerRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // check login status on first load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getLoginStatus();
        setIsLoggedIn(status);
        if (status) {
          const currentUser = await getUser();
          setUser(currentUser);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const register = async (userData) => {
    const data = await registerRequest(userData);
    setUser(data);
    setIsLoggedIn(true);
    return data;
  };

  const login = async (userData) => {
    const data = await loginRequest(userData);
    setUser(data);
    setIsLoggedIn(true);
    return data;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setIsLoggedIn(false);
  };

  // role helpers
  const role = user?.role;
  const isAdmin = role === "admin";
  const canManageProducts = role === "admin" || role === "manager";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        register,
        login,
        logout,
        role,
        isAdmin,
        canManageProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

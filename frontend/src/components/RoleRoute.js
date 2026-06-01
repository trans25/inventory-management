import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// restricts a route to specific roles. usage: <RoleRoute roles={["admin"]}>
const RoleRoute = ({ roles, children }) => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;

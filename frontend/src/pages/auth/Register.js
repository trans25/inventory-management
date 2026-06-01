import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, password2 } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed, please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" fontWeight={700}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          name="password2"
          value={password2}
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" disabled={isLoading} size="large">
          {isLoading ? "Creating account..." : "Register"}
        </Button>
        <Typography variant="body2" align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;

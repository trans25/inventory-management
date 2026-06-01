import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH !== "false";
const DEMO_USERS = [
  { role: "admin", email: "admin@demo.com" },
  { role: "manager", email: "manager@demo.com" },
  { role: "shop", email: "shop@demo.com" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed, please try again");
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
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
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
        <Button type="submit" disabled={isLoading} size="large">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        {USE_MOCK_AUTH && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Demo mode — click a role to fill credentials (password:
              &nbsp;password)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {DEMO_USERS.map((u) => (
                <Chip
                  key={u.role}
                  label={u.role}
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    setFormData({ email: u.email, password: "password" })
                  }
                />
              ))}
            </Stack>
          </Box>
        )}
        <Typography variant="body2" align="center">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;

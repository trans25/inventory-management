import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Alert,
  Box,
} from "@mui/material";
import {
  getUsers,
  updateUserRole,
  getActivities,
} from "../../services/adminService";

const ROLES = ["admin", "manager", "shop"];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [userData, activityData] = await Promise.all([
        getUsers(),
        getActivities(),
      ]);
      setUsers(userData);
      setActivities(activityData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin Panel
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <Paper sx={{ p: 2, overflowX: "auto" }} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Activity Log
        </Typography>
        <Paper sx={{ p: 2, overflowX: "auto" }} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((a) => (
                <TableRow key={a._id} hover>
                  <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{a.userName || "—"}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell>{a.entity}</TableCell>
                  <TableCell>{a.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default Admin;

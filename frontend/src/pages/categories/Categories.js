import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
} from "@mui/material";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name) {
      setError("Please add a category name");
      return;
    }
    try {
      await createCategory({ name });
      setName("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Categories
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Add Category
          </Typography>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
            elevation={1}
          >
            <TextField
              label="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button type="submit">Add Category</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            All Categories
          </Typography>
          <Paper sx={{ p: 2 }} elevation={1}>
            {categories.length === 0 ? (
              <Typography>No categories yet.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat._id} hover>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box />
    </Container>
  );
};

export default Categories;

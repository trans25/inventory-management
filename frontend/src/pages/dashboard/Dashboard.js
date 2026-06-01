import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Stack,
} from "@mui/material";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "../../components/ProductForm";
import InventoryCharts from "../../components/InventoryCharts";
import {
  exportProductsToPDF,
  exportProductsToExcel,
} from "../../utils/exportData";

const StatCard = ({ label, value }) => (
  <Card sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
    <CardContent>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { canManageProducts } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    await loadData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Inventory Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total Products" value={products.length} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Total Stock Value" value={totalValue.toFixed(2)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Categories" value={categories.length} />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
        <Button onClick={() => exportProductsToPDF(products)}>Export PDF</Button>
        <Button onClick={() => exportProductsToExcel(products)}>
          Export Excel
        </Button>
        <Button component={Link} to="/categories" variant="outlined">
          Manage Categories
        </Button>
        <Button component={Link} to="/orders" variant="outlined">
          Orders
        </Button>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <InventoryCharts products={products} />
      </Box>

      <Grid container spacing={3}>
        {canManageProducts && (
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Add Product
            </Typography>
            <Paper sx={{ p: 2 }} elevation={1}>
              <ProductForm
                categories={categories}
                onSubmit={handleCreate}
                submitLabel="Add Product"
              />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={canManageProducts ? 8 : 12}>
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>
          <Paper sx={{ p: 2, overflowX: "auto" }} elevation={1}>
            {products.length === 0 ? (
              <Typography>No products yet.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Value</TableCell>
                    {canManageProducts && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} hover>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        {(
                          Number(product.price) * Number(product.quantity)
                        ).toFixed(2)}
                      </TableCell>
                      {canManageProducts && (
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to={`/edit-product/${product._id}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

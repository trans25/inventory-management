import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Typography, Paper, Box, Alert } from "@mui/material";
import ProductForm from "../../components/ProductForm";
import { getProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProduct(id),
          getCategories(),
        ]);
        setProduct(productData);
        setCategories(categoryData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (payload) => {
    await updateProduct(id, payload);
    navigate("/dashboard");
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Edit Product
      </Typography>
      <Paper sx={{ p: 3 }} elevation={1}>
        <Box>
          <ProductForm
            initialValues={product}
            categories={categories}
            onSubmit={handleUpdate}
            submitLabel="Update Product"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProduct;

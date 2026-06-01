import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";

const ProductForm = ({
  initialValues,
  categories,
  onSubmit,
  submitLabel = "Save Product",
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    sku: initialValues?.sku || "",
    category: initialValues?.category || "",
    quantity: initialValues?.quantity || "",
    price: initialValues?.price || "",
    description: initialValues?.description || "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialValues?.image?.filePath || null
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, category, quantity, price, description } = formData;
    if (!name || !category || !quantity || !price || !description) {
      setError("Please fill in all fields");
      return;
    }

    const payload = { ...formData };
    if (image) {
      payload.image = image;
    }

    try {
      setIsLoading(true);
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="SKU"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="">
          <em>-- Select Category --</em>
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Quantity"
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        minRows={3}
        fullWidth
      />
      <Button variant="outlined" component="label">
        Upload Image
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </Button>
      {imagePreview && (
        <Box
          component="img"
          src={imagePreview}
          alt="preview"
          sx={{
            width: "100%",
            maxHeight: 150,
            objectFit: "contain",
            border: "1px solid #eee",
            borderRadius: 1,
          }}
        />
      )}
      <Button type="submit" disabled={isLoading} size="large">
        {isLoading ? "Saving..." : submitLabel}
      </Button>
      <Typography variant="caption" color="text.secondary">
        Images require Cloudinary configuration on the backend.
      </Typography>
    </Box>
  );
};

export default ProductForm;

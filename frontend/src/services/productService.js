import api from "./api";

// build a FormData object from a product so we can send an image file
const toFormData = (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key]);
    }
  });
  return formData;
};

// create a new product (supports image file upload)
export const createProduct = async (productData) => {
  const response = await api.post("/products", toFormData(productData), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// get all products for the logged in user
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// get a single product by id
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// delete a product by id
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// update a product by id (supports image file upload)
export const updateProduct = async (id, productData) => {
  const response = await api.patch(`/products/${id}`, toFormData(productData), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

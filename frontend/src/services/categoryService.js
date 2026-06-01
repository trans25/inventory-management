import api from "./api";

// get all categories for the logged in user
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// create a new category
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// delete a category by id
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

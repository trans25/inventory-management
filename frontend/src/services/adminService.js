import api from "./api";

// get all users (admin only)
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// update a user's role (admin only)
export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

// get activity log (admin only)
export const getActivities = async () => {
  const response = await api.get("/activities");
  return response.data;
};

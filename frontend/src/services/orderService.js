import api from "./api";

// get all orders for the logged in user
export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// update an order's status
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

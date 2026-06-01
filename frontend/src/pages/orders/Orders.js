import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Chip,
} from "@mui/material";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { useSocketEvent } from "../../hooks/useSocket";

const statusColor = {
  pending: "warning",
  delivered: "success",
  cancelled: "error",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const load = async () => {
    try {
      const [orderData, productData] = await Promise.all([
        getOrders(),
        getProducts(),
      ]);
      setOrders(orderData);
      setProducts(productData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // real-time: refresh and notify when an order is created
  const handleOrderCreated = useCallback((order) => {
    setNotification(`New order placed (${order.status})`);
    setOrders((prev) => {
      if (prev.find((o) => o._id === order._id)) return prev;
      return [order, ...prev];
    });
  }, []);

  // real-time: update when an order status changes
  const handleOrderUpdated = useCallback((order) => {
    setNotification(`Order updated: ${order.status}`);
    setOrders((prev) =>
      prev.map((o) => (o._id === order._id ? order : o))
    );
  }, []);

  useSocketEvent("orderCreated", handleOrderCreated);
  useSocketEvent("orderUpdated", handleOrderUpdated);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) {
      setError("Please select a product");
      return;
    }
    try {
      await createOrder({
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: Number(quantity),
          },
        ],
      });
      setSelectedProduct("");
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Orders
      </Typography>
      {notification && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {notification}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        component="form"
        onSubmit={handlePlaceOrder}
        sx={{ p: 2, mb: 3 }}
        elevation={1}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            select
            label="Product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">
              <em>-- Select Product --</em>
            </MenuItem>
            {products.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name} ({p.price})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ width: 120 }}
          />
          <Button type="submit">Place Order</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, overflowX: "auto" }} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>{order._id.slice(-6)}</TableCell>
                <TableCell>
                  {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                </TableCell>
                <TableCell>{Number(order.totalAmount).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={statusColor[order.status] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {order.status === "pending" && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        sx={{ mr: 1 }}
                        onClick={() =>
                          handleStatusChange(order._id, "delivered")
                        }
                      >
                        Deliver
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(order._id, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Orders;

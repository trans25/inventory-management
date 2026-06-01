const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require("../controllers/orderController")

router.post("/", protect, createOrder)
router.get("/", protect, getOrders)
router.patch("/:id/status", protect, updateOrderStatus)

module.exports = router

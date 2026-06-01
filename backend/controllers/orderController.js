const asyncHandler = require("express-async-handler")
const Order = require("../models/orderModel")
const logActivity = require("../utils/logActivity")

//create order (shop places an order)
const createOrder = asyncHandler(async (req, res) => {
    const { items } = req.body

    if (!items || items.length === 0) {
        res.status(400)
        throw new Error("Please add at least one item to the order")
    }

    const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
        0
    )

    const order = await Order.create({
        user: req.user._id,
        items,
        totalAmount,
        status: "pending"
    })

    //real-time notification
    const io = req.app.get("io")
    if (io) {
        io.emit("orderCreated", order)
    }

    await logActivity(req, {
        action: "create",
        entity: "Order",
        details: `Placed order totalling ${order.totalAmount}`
    })

    res.status(201).json(order)
})

//get all orders of logged in user
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt")
    res.status(200).json(orders)
})

//update order status (warehouse delivers / shop cancels)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
        res.status(404)
        throw new Error("Order not found")
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User not authorized")
    }

    order.status = status || order.status
    const updatedOrder = await order.save()

    //real-time notification
    const io = req.app.get("io")
    if (io) {
        io.emit("orderUpdated", updatedOrder)
    }

    await logActivity(req, {
        action: "update",
        entity: "Order",
        details: `Order ${updatedOrder._id} marked ${updatedOrder.status}`
    })

    res.status(200).json(updatedOrder)
})

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
}

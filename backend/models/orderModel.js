const mongoose = require("mongoose")

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    name: { type: String },
    price: { type: String },
    quantity: { type: Number, default: 1 }
}, { _id: false })

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "delivered", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order

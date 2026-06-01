const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Please add a category name"],
        trim: true
    }
}, {
    timestamps: true
})

const Category = mongoose.model("Category", categorySchema)
module.exports = Category

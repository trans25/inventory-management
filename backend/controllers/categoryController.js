const asyncHandler = require("express-async-handler")
const Category = require("../models/categoryModel")
const logActivity = require("../utils/logActivity")

//create category
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name) {
        res.status(400)
        throw new Error("Please add a category name")
    }

    const category = await Category.create({
        user: req.user._id,
        name
    })

    await logActivity(req, {
        action: "create",
        entity: "Category",
        details: `Created category "${category.name}"`
    })

    res.status(201).json(category)
})

//get all categories of logged in user
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user._id }).sort("-createdAt")
    res.status(200).json(categories)
})

//delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
        res.status(404)
        throw new Error("Category not found")
    }

    if (category.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User not authorized")
    }

    await category.deleteOne()
    await logActivity(req, {
        action: "delete",
        entity: "Category",
        details: `Deleted category "${category.name}"`
    })
    res.status(200).json({ message: "Category deleted" })
})

module.exports = {
    createCategory,
    getCategories,
    deleteCategory
}

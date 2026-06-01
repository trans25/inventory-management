const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
    createCategory,
    getCategories,
    deleteCategory
} = require("../controllers/categoryController")

router.post("/", protect, createCategory)
router.get("/", protect, getCategories)
router.delete("/:id", protect, deleteCategory)

module.exports = router

const express = require("express")
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const authorize = require("../middleware/roleMiddleware")
const upload = require("../middleware/uploadMiddleware")
const {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
} = require("../controllers/productController")

//create a product (admin/manager only)
router.post("/", protect, authorize("admin", "manager"), upload.single("image"), createProduct)

//get all products
router.get("/", protect, getProducts)

//get single product
router.get("/:id", protect, getProduct)

//delete a product (admin/manager only)
router.delete("/:id", protect, authorize("admin", "manager"), deleteProduct)

//update a product (admin/manager only)
router.patch("/:id", protect, authorize("admin", "manager"), upload.single("image"), updateProduct)

module.exports = router

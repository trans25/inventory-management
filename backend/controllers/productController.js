const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const { uploadToCloudinary } = require("../utils/cloudinary")
const logActivity = require("../utils/logActivity")

//create product
const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body

    //validation
    if (!name || !category || !quantity || !price || !description) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    //handle image upload
    let fileData = {}
    if (req.file) {
        let uploadedFile
        try {
            uploadedFile = await uploadToCloudinary(req.file.buffer)
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            fileType: req.file.mimetype
        }
    }

    //create product
    const product = await Product.create({
        user: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    })

    await logActivity(req, {
        action: "create",
        entity: "Product",
        details: `Created product "${product.name}"`
    })

    res.status(201).json(product)
})

//get all products of logged in user
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id }).sort("-createdAt")
    res.status(200).json(products)
})

//get single product
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    //match product to its user
    if (product.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User not authorized")
    }

    res.status(200).json(product)
})

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    //match product to its user
    if (product.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User not authorized")
    }

    await product.deleteOne()
    await logActivity(req, {
        action: "delete",
        entity: "Product",
        details: `Deleted product "${product.name}"`
    })
    res.status(200).json({ message: "Product deleted" })
})

//update product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, description } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error("Product not found")
    }

    //match product to its user
    if (product.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User not authorized")
    }

    //handle image upload
    let fileData = product.image
    if (req.file) {
        let uploadedFile
        try {
            uploadedFile = await uploadToCloudinary(req.file.buffer)
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            fileType: req.file.mimetype
        }
    }

    //update product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        {
            name,
            category,
            quantity,
            price,
            description,
            image: fileData
        },
        {
            new: true,
            runValidators: true
        }
    )

    await logActivity(req, {
        action: "update",
        entity: "Product",
        details: `Updated product "${updatedProduct.name}"`
    })

    res.status(200).json(updatedProduct)
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}

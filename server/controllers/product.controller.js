import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, subCategories } = req.body
    const imageFiles = req.files

    // if(
    //     [ name, description, price, stock, category, subCategories].some((field) => field.trim() === "")
    // ){
    //     throw new ApiError(400, "All fields are required.")
    // }

    if (!(name || description || price || stock || category)) {
        throw new ApiError(400, "All fields are required.")
    }

    if (!imageFiles && imageFiles.length === 0) {
        throw new ApiError(400, "Atlest upload a picture.")
    }

    let uploadResult;
    try {
        const uploadPromise = imageFiles.map(file =>
            uploadOnCloudinary(file.buffer))
        uploadResult = await Promise.all(uploadPromise)
    } catch (error) {
        console.error("cloudinary upload error", error);
        throw new ApiError(500, "Failed to upload product images. Please try again.")
    }

    if (!uploadResult || uploadResult.some(result => !result)) {
        throw new ApiError(500, "One or more image uploads failed.")
    }

    const imagesForDb = uploadResult.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
    }))

    const product = await ProductModel.create({
        name,
        description,
        price,
        stock,
        category,
        subCategories,
        images: imagesForDb,
        seller: req.user?._id,
    })

    await UserModel.findByIdAndUpdate(req.user?._id, {
        $push: { products_listed: product._id }
    })

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { name, description, price, stock, category, subCategories } = req.body
    const imageFiles = req.files

    const product = await ProductModel.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found.")
    }

    if (product.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this product.");
    }


    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (subCategories) product.subCategories = subCategories;

    if (imageFiles && imageFiles.length > 0) {

        const deletePromise = product.images.map(image => deleteFromCloudinary(image.public_id))
        await Promise.all(deletePromise)

        const uploadPromise = imageFiles.map(file => uploadOnCloudinary(file.buffer))

        const uploadResult = await Promise.all(uploadPromise)
        if (!uploadResult || uploadResult.some(result => !result)) {
            throw new ApiError(500, "One or more image uploads failed.")
        }

        const imageForDb = uploadResult.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }))

        product.images = imageForDb
    }

    await product.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    )


})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const product = await ProductModel.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found.")
    }

    if (product.seller.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this product.")
    }

    if (product.images && product.images.length > 0) {
        const deletePromise = product.images.map(image => deleteFromCloudinary(image.public_id))
        await Promise.all(deletePromise);
    }

    await ProductModel.findByIdAndDelete(productId)

    await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { products_listed: productId }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully.")
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid Product Id format.")
    }
    const product = await ProductModel.findById(productId)
        .populate("seller", "store_name averageRating")
        .populate("category", "name slug")
        .populate("subCategories", "name slug")

    if (!product || !product.isPublished) {
        throw new ApiError(404, "Product not found.")
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully.")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        category,
        subCategory,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query

    const query = { isPublished: true }

    if (category) {
        query.category = category
    }
    if (subCategory) {
        query.subCategories = subCategory
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

    // --- Pagination ----
    const skip = (page - 1) * limit

    // ---Query execution ---
    const products = await ProductModel.find(query)
        .populate("seller", "store_name averageRating")
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))

    const totalProducts = await ProductModel.countDocuments(query)

    const responsePayload = {
        products,
        pagination: {
            totalProducts,
            totalPage: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page)
        }
    }

    return res.status(200).json(
        new ApiResponse(200, responsePayload, "All products fetched successfully.")
    )

})

const getMyProducts = asyncHandler(async (req, res) => {
    const sellerId = req.user?._id

    const myProducts = await ProductModel.find({ seller: sellerId })
        .populate("category", "name")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, myProducts, "Products fetched successfully.")
    )
})


export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
    getMyProducts
}
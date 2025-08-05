import { CategoryModel } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../config/cloudinary.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    const imageFile = req.file

    const trimmedName = name.trim()

    if (!name || trimmedName === "") {
        throw new ApiError(400, "Category name required")
    }
    if (!imageFile) {
        throw new ApiError(400, "Category image is required")
    }

    const existedcategory = await CategoryModel.findOne({ name: trimmedName })
    if (existedcategory) {
        throw new ApiError(409, "A category with this name already exists.")
    }

    const cloudinaryResponse = await uploadOnCloudinary(imageFile.buffer)
    if (!cloudinaryResponse || !cloudinaryResponse.public_id) {
        throw new ApiError(500, "Error uploading the category image.");
    }

    const imageForDb = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id
        }

    const slug = trimmedName.toLowerCase().replace(/\s+/g, '-');

    const category = await CategoryModel.create({
        name: trimmedName,
        image: imageForDb,
        slug: slug
    })

    return res.status(201).json(
        new ApiResponse(201, category, "Category created Successfully.")
    )
})


const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { name } = req.body
    const imageFile = req.file

    const category = await CategoryModel.findById(categoryId)
    if (!category) {
        throw new ApiError(404, "Category not found.")
    }

    if (name && name.trim() !== "") {
        category.name = name.trim();
        category.slug = name.trim().toLowerCase().replace(/\S+/g, '-')
    }

    // upload image if new one is provided
    if (imageFile) {
        //first delete old one
        await deleteFromCloudinary(category.image.public_id);

        //upload new

        const cloudinaryResponse = await uploadOnCloudinary(imageFile.buffer)
        if (!cloudinaryResponse || !cloudinaryResponse.public_id) {
            throw new ApiError(500, "Something went wrong while uploading new category image.")
        }

        category.image = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id
        }
    }
    await category.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, category, "Category updated successfully.")
    )

})

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params

    const category = await CategoryModel.findById(categoryId)
    if (!category) {
        throw new ApiError(404, "Category not found,")
    }

    //first delete image from cloudinary
    await deleteFromCloudinary(category.image.public_id)

    // then delete categoryId
    await CategoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Category deleted successfully.")
    )
})


//Public controllers

const getAllCategory = asyncHandler(async (req, res) => {
    const allCategory = await CategoryModel.find({})

    return res.status(200).json(
        new ApiResponse(200, allCategory, "All category fetched successfully.")
    )

})

const getCategory = asyncHandler(async (req, res) => {
    const { slugOrId } = req.params;

    // Find by slug first, then fall back to finding by ID
    const category = await CategoryModel.findOne({
        $or: [{ slug: slugOrId }, { _id: slugOrId }]
    });

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, category, "Category fetched successfully.")
    );
});


export {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getCategory
}
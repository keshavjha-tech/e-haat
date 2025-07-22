import { CategoryModel } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    const imageFile = req.file

    const trimmedName = name.trim()

    if (!name || trimmedName === "") {
        throw new ApiError(400, "Category name required")
    }
    if(!imageFile){
        throw new ApiError(400, "Category image is required")
    }

    const existedcategory = await CategoryModel.findOne({ name: trimmedName })
    if (existedcategory) {
        throw new ApiError(409, "Category Already exists.")
    }

    const cloudinaryResponse = await uploadOnCloudinary(imageFile.buffer)
    if(!cloudinaryResponse || !cloudinaryResponse.publicId){
        throw new ApiError(500, "Error uploading the category image.");
    }

    const slug = trimmedName.toLowerCase().replace(/\s+/g, '-');

    const category = await CategoryModel.create({
        name: trimmedName,
        image: {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.publicId
        },
        slug: slug
    })

    return res.status(201).json(
        new ApiResponse(201, category, "Category created Successfully")
    )
})

const getAllCategory = asyncHandler(async (req, res) => {

})

const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { name } = req.body
    const imageFile = req.file

    await CategoryModel.findByIdAndUpdate(
        categoryId
    )

})

export {
    createCategory,
    getAllCategory
}
import { SubCategoryModel } from "../models/subCategory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { CategoryModel } from "../models/category.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const createSubCategory = asyncHandler(async (req, res) => {
    const { name, parentCategories } = req.body
    const imageFile = req.file


    const trimmedName = name.trim()
    if (!name || trimmedName === "" || !parentCategories || parentCategories.length === 0) {
        throw new ApiError(400, "Sub-category name and a parent category ID are required.")
    }

    if (!imageFile) {
        throw new ApiError(400, "Sub-category image is required.");
    }

    const categoryCount = await CategoryModel.countDocuments({
        '_id': { $in: parentCategories }
    });

    if (categoryCount !== parentCategories.length) {
        throw new ApiError(404, "One or more parent categories were not found.");
    }


    const existedSubCategory = await SubCategoryModel.findOne({ name: trimmedName })
    if (existedSubCategory) {
        throw new ApiError(409, "A sub-category with this name already exists.")
    }

    const cloudinaryResponse = await uploadOnCloudinary(imageFile.buffer)
    if (!cloudinaryResponse || !cloudinaryResponse.public_id) {
        throw new ApiError(500, "Error during uploading sub-category image")
    }

    const imageForDb = {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id
    }

    const slug = trimmedName.toLowerCase().replace(/\s+/g, '-');

    const subCategory = await SubCategoryModel.create({
        name: trimmedName,
        image: imageForDb,
        slug,
        parentCategories: parentCategories
    })

    return res.status(201).json(
        new ApiResponse(201, subCategory, "Sub-category created Successfully.")
    )
})


const updateSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params
    const { name, parentCategories } = req.body
    const imageFile = req.file

    const subCategory = await SubCategoryModel.findById(subCategoryId)
    if (!subCategory) {
        throw new ApiError(404, "Sub-category not found.")
    }

    if (name && name.trim() !== "") {
        subCategory.name = name.trim();
        subCategory.slug = name.trim().toLowerCase().replace(/\s+/g, '-')
    }

    // parentcategories
    if (parentCategories && Array.isArray(parentCategories)) {
        const categoryCount = await CategoryModel.countDocuments({
            '_id': { $in: parentCategories }
        })

        if (categoryCount !== parentCategories.length) {
            throw new ApiError(404, "One or more parent categories were not found.");
        }
        subCategory.parentCategories = parentCategories
    }

    if (imageFile) {
        await deleteFromCloudinary(subCategory.image?.public_id)

        const cloudinaryResponse = await uploadOnCloudinary(imageFile.buffer)
        if (!cloudinaryResponse || !cloudinaryResponse.public_id) {
            throw new ApiError(500, "Something went wrong while updating sub-category image.")
        }

        subCategory.image = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id
        }
    }

    await subCategory.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, subCategory, "Sub-category updated successfully.")
    )
})


const deleteSubCategory  = asyncHandler(async(req, res) => {
    const { subCategoryId } = req.params

    const subCategory = await SubCategoryModel.findById(subCategoryId)
    if(!subCategory){
        throw new ApiError(404, "Sub-category not found.")
    }

    await deleteFromCloudinary(subCategory.image?.public_id)

    await SubCategoryModel.findByIdAndDelete(subCategoryId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Sub-category deleted successfully.")
    )
})

const getAllSubCategories = asyncHandler(async(req, res) => {

    const allSubCategories = await SubCategoryModel.find({}).populate('parentCategories', 'name')

    return res.status(200).json(
        new ApiResponse(200, allSubCategories, "All Sub-categories successfully fetced.")
    )
})

const getSubCategoriesForCategory = asyncHandler(async(req, res) => {
    const { categoryId } = req.params

    const subCategories = await SubCategoryModel.find({ parentCategories: categoryId })

    return res.status(200).json(
        new ApiResponse(200, subCategories, "All Sub-categories successfully fetced.")
    )
})


export {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAllSubCategories,
    getSubCategoriesForCategory
}
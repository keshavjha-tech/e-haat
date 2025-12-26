import { UserModel } from "../models/user.model.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user?._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "A valid Product id is required.");
    }

    const product = await ProductModel.findById(productId);
    if (!product || !product.isPublished) {
        throw new ApiError(404, "Product not found.");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
        throw new ApiError(400, "Product is already in your wishlist.");
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save({ validateBeforeSave: false });

    const updatedUser = await UserModel.findById(userId)
        .populate('wishlist', 'name price images discount stock averageRating numOfReviews');

    return res.status(200).json(
        new ApiResponse(200, updatedUser.wishlist, "Product added to wishlist successfully.")
    );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user?._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "A valid Product id is required.");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
        throw new ApiError(400, "Product is not in your wishlist.");
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(
        id => id.toString() !== productId.toString()
    );
    await user.save({ validateBeforeSave: false });

    const updatedUser = await UserModel.findById(userId)
        .populate('wishlist', 'name price images discount stock averageRating numOfReviews');

    return res.status(200).json(
        new ApiResponse(200, updatedUser.wishlist, "Product removed from wishlist successfully.")
    );
});

const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await UserModel.findById(userId)
        .populate({
            path: 'wishlist',
            select: 'name description price discount images stock averageRating numOfReviews category seller',
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'seller', select: 'store_name averageRating' }
            ]
        });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, user.wishlist || [], "Wishlist fetched successfully.")
    );
});

const checkWishlistStatus = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user?._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "A valid Product id is required.");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isInWishlist = user.wishlist.some(
        id => id.toString() === productId.toString()
    );

    return res.status(200).json(
        new ApiResponse(200, { isInWishlist }, "Wishlist status fetched successfully.")
    );
});

export {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlistStatus
};


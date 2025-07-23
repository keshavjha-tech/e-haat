import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { } from "../utils/ApiResponse.js"
import mongoose from "mongoose";

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body
    const userId = req.user?._id

    if (!productId || !mongoose.Types.ObjectId(productId)) {
        throw new ApiError(400, "A valid Product id required.")
    }

    const product = await ProductModel.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found.")
    }


    if (product.stock <= 0 || product.stock < quantity) {
        throw new ApiError(400, "This product is currently out of stock.");
    }
    let cart = await CartModel.findOne({ user: userId })

    if (!cart) {
        cart = await CartModel.create({
            user: userId,
            items: []
        })
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId)

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += parseInt(quantity, 10)
    } else {
        cart.items.push({ product: productId, quantity: parseInt(quantity, 10) })
    }

    const updatedCart = await cart.save()

    const populatedCart = await updatedCart.populate({
        path: 'items.product',
        select: 'name price images stock'
    })
    
    return res.status(200).json(
        new ApiResponse(200, populatedCart, "Item added to cart successfully.")
    );

})

export {
    addItemToCart
}
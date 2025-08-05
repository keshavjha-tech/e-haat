import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
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

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const cart = await CartModel.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name images price stock'
    })

    if (!cart || cart.items.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, {
                items: [],
                subTotal: 0,
                total: 0
            }, "Your cart is empty.")
        )
    }


    const subtotal = cart.items.reduce((acc, item) => {
        if (item.product) {
            return acc + (item.product.price * item.quantity)
        }
        return acc;
    }, 0)

    const discount = 0; // Todo: add logic
    const shipping = 0; // Todo: add logic
    const total = subtotal - discount + shipping;

    const cartResponse = {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        summary: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2),
        }
    }


    return res.status(200).json(
        new ApiResponse(200, cartResponse, "Cart fetched successfully.")
    );
})

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body
    const userId = req.user?._id

    if (!quantity || quantity < 1) {
        throw new ApiError(400, "A valid quantity is required.")
    }

    const cart = await CartModel.findOne({ user: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found.")
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart.")
    }

    cart.items[itemIndex].quantity = parseInt(quantity, 10)

    return res.status(200).json(
       new ApiResponse (200, cart, "Cart quantity updated successfully.")
    )
})

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const userId = req.user?._id

    const updatedCart = await CartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    )

    if (!updatedCart) {
        throw new ApiError(404, "Cart not found or items was not in the cart.")
    }

    return res.status(200).json(new ApiResponse(200, updatedCart, "Item removed from the cart."))
})

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const cart = await CartModel.findOne({ user: userId })
    if (!cart) { throw new ApiError(404, "Cart not found.") }

    cart.items = []
    await cart.save()

    return res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully."));
})

export {
    addItemToCart,
    getCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart
}
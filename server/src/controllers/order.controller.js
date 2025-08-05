import { OrderModel } from "../models/order.model.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { CartModel } from "../models/cart.model.js";
import { AddressModel } from "../models/address.model.js";
import { ProductModel } from "../models/product.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { addressId } = req.body

    if (!addressId) {
        throw new ApiError(400, "Address ID is required for shipping.")
    }

    const [cart, shippingAddress] = await Promise.all([
        CartModel.findOne({ user: userId }).populate('items.product'),
        AddressModel.findById(addressId).lean() //give js object
    ])

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty. Cannot process order.")
    }

    if (!shippingAddress) {
        throw new ApiError(404, "Shipping address not found.")
    }

    const orderItems = []
    let itemsPrice = 0;

    for (const item of cart.items) {
        const product = item.product
        if (item.quantity > product.stock) {
            throw new ApiError(400, `${product.name} is out of stock.`)
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            image: product.images[0]?.url || "",
            seller: product.seller
        })

        itemsPrice += product.price * item.quantity
    }

    const shippingPrice = itemsPrice > 499 ? 0 : 50
    const discountPrice = 0 //todo: implement logic
    const totalPrice = itemsPrice + shippingPrice - discountPrice;

    const order = await OrderModel.create({
        user: userId,
        orderItems,
        shippingInfo: {
            addressLine1: shippingAddress.addressLine1,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pinCode: shippingAddress.pinCode,
            country: shippingAddress.country
        },
        paymentInfo: { status: "Pending." },
        orderTotals: { itemsPrice, shippingPrice, discountPrice, totalPrice }
    })

    if (!order) {
        throw new ApiError(500, "Something went wrong while creating order.")
    }

    await Promise.all([
        ...order.orderItems.map(item => ProductModel.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })),
        CartModel.findByIdAndUpdate(cart._id, { $set: { items: [] } })
    ])

    return res.status(200).json(
        new ApiResponse(200, order, "Order placed successfully.")
    )
})

const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await OrderModel.find({ user: req.user._id }).sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders fetched successfully.")
    )
})

const getOrderById = asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id).populate("user", "name email");

    if (!order) {
        throw new ApiError(404, "Ordenot found.")
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not authorized to view.")
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order details retrieved successfully."))

})

const updateOrdeItemStatus = asyncHandler(async (req, res) => {
    const { orderId, itemId } = req.params
    const { status } = req.body

    const order = await OrderModel.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    const orderItem = order.orderItems.id(itemId)
    if (!orderItem) {
        throw new ApiError(404, "Item not found within the order.")
    }


    const isAdmin = loggedInUser.role === 'ADMIN';
    const isSeller = orderItem.seller.equals(req.user._id);

    if (!isAdmin && !isSeller) {
        throw new ApiError(403, "You are not authorized to update this item's status.");
    }

    orderItem.orderStatus = status;
    if (status === 'Delivered') {
        orderItem.deliveredAt = new Date();
    }

    await order.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, order, "Order item status updated.")
    )
})

export {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrdeItemStatus
}
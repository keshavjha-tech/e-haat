import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { OrderModel } from '../models/order.model.js';
import { CartModel } from '../models/cart.model.js';
import { AddressModel } from '../models/address.model.js';
import { ProductModel } from '../models/product.model.js';

// Initialize Razorpay instance
// Note: Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Create Razorpay order
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { addressId } = req.body;

    if (!addressId) {
        throw new ApiError(400, "Address ID is required for shipping.");
    }

    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new ApiError(500, "Payment gateway is not configured. Please contact support.");
    }

    // Get cart and address
    const [cart, shippingAddress] = await Promise.all([
        CartModel.findOne({ user: userId }).populate('items.product'),
        AddressModel.findById(addressId)
    ]);

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty. Cannot process order.");
    }

    if (!shippingAddress) {
        throw new ApiError(404, "Shipping address not found.");
    }

    // Calculate order totals
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of cart.items) {
        const product = item.product;
        if (!product) {
            throw new ApiError(400, "Some products in your cart are no longer available.");
        }

        if (item.quantity > product.stock) {
            throw new ApiError(400, `${product.name} is out of stock. Available: ${product.stock}`);
        }

        const itemPrice = product.discount > 0
            ? product.price - (product.price * product.discount / 100)
            : product.price;

        orderItems.push({
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            price: itemPrice,
            image: product.images[0]?.url || "",
            seller: product.seller
        });

        itemsPrice += itemPrice * item.quantity;
    }

    const shippingPrice = itemsPrice > 499 ? 0 : 50;
    const discountPrice = 0; // TODO: implement discount logic
    const totalPrice = itemsPrice + shippingPrice - discountPrice;

    // Create order in database first (with pending payment)
    const order = await OrderModel.create({
        user: userId,
        orderItems,
        shippingInfo: {
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            pinCode: shippingAddress.pinCode,
            country: shippingAddress.country,
            fullName: shippingAddress.fullName,
            mobile: shippingAddress.mobile
        },
        paymentInfo: {
            status: "Pending"
        },
        orderTotals: {
            itemsPrice,
            shippingPrice,
            discountPrice,
            totalPrice
        }
    });

    if (!order) {
        throw new ApiError(500, "Something went wrong while creating order.");
    }

    // Create Razorpay order
    const razorpayOptions = {
        amount: Math.round(totalPrice * 100), // Convert to paise (Razorpay expects amount in smallest currency unit)
        currency: "INR",
        receipt: `order_${order._id}`,
        notes: {
            orderId: order._id.toString(),
            userId: userId.toString()
        }
    };

    try {
        const razorpayOrder = await razorpay.orders.create(razorpayOptions);

        // Update order with Razorpay order ID
        order.paymentInfo.razorpayOrderId = razorpayOrder.id;
        await order.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(200, {
                orderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            }, "Razorpay order created successfully.")
        );
    } catch (error) {
        // If Razorpay order creation fails, delete the database order
        await OrderModel.findByIdAndDelete(order._id);
        console.error("Razorpay order creation error:", error);
        throw new ApiError(500, "Failed to create payment order. Please try again.");
    }
});

// Verify payment and update order
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
        throw new ApiError(400, "All payment details are required.");
    }

    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new ApiError(500, "Payment gateway is not configured.");
    }

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed. Invalid signature.");
    }

    // Find and update the order
    const order = await OrderModel.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.paymentInfo.status === "Paid") {
        return res.status(200).json(
            new ApiResponse(200, order, "Payment already verified.")
        );
    }

    // Update order with payment information
    order.paymentInfo = {
        razorpayOrderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "Paid"
    };
    order.paidAt = new Date();
    order.overallStatus = "Processing";

    // Reduce product stock and clear cart
    const cart = await CartModel.findOne({ user: order.user });

    await Promise.all([
        ...order.orderItems.map(item =>
            ProductModel.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            })
        ),
        cart ? CartModel.findByIdAndUpdate(cart._id, { $set: { items: [] } }) : Promise.resolve(),
        order.save({ validateBeforeSave: false })
    ]);

    return res.status(200).json(
        new ApiResponse(200, order, "Payment verified and order confirmed successfully.")
    );
});

// Get payment status
const getPaymentStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user?._id;

    const order = await OrderModel.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to view this order.");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            orderId: order._id,
            paymentStatus: order.paymentInfo.status,
            paidAt: order.paidAt,
            amount: order.orderTotals.totalPrice
        }, "Payment status retrieved successfully.")
    );
});

export {
    createRazorpayOrder,
    verifyPayment,
    getPaymentStatus
};


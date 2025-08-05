import mongoose, { Schema } from 'mongoose'

const orderItemSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: { //of single unit
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    deliveredAt: { type: Date }
})


const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderItems: [orderItemSchema],

    shippingInfo: {
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, required: true },
    },

    paymentInfo: {
        paymentId: {
            type: String
        },
        status: {
            type: String,
            default: "Pending",
            required: true
        }
    },
    paidAt: {
        type: Date
    },
    orderTotals: {
        itemsPrice: { type: Number, required: true, default: 0 },
        discountPrice: { type: Number, required: true, default: 0 },
        shippingPrice: { type: Number, required: true, default: 0 },
        totalPrice: { type: Number, required: true, default: 0 }
    },
    overallStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Partially Shipped', 'Shipped', 'Completed'],
        default: 'Processing'
    }
}, { timestamps: true })

export const OrderModel = mongoose.model('Order', orderSchema);
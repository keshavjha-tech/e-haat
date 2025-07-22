import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    images: [{
        url: { type: String, required: true },
        publicId: { type: String, required: true }
    }],
    categoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    sub_CategoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory'
        }
    ],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

export const ProductModel = mongoose.model('product', productSchema)
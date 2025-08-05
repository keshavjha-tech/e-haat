import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product name is required."],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required."]
    },
    price: {
        type: Number,
        required: [true, "Product price is required."],
        min: [0, "Price cannot be negative."]
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative."]
    },

    //------Media------
    images: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true } 
    }],

    // --- Categorization ---
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],


    // --- Inventory & Shipping ---
    stock: {
        type: Number,
        required: [true, "Stock quantity is required."],
        default: 0,
        min: [0, "Stock cannot be negative."]
    },
    unit: { // e.g., "kg", "piece", "liter"
        type: String,
        default: "piece"
    },


    // --- Seller & Status ---
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },


    // --- Ratings ---
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },

    // --- Additional Details ---
    more_details: {
        type: Map,
        of: String
    },

}, { timestamps: true })

export const ProductModel = mongoose.model('Product', productSchema)
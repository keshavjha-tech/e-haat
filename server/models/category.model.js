import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "",
        unique: true,
        trim: true
    },
    image: {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
    },
    slug: {
        type: String, // For URL-friendly names (e.g., "home-and-garden")
        unique: true,
        lowercase: true
    }
}, { timestamps: true })

export const CategoryModel = mongoose.model('category', categorySchema)
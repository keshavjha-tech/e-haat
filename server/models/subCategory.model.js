import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Sub-category name is required."],
        unique: true, 
        trim: true
    },
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true } 
    },
    parentCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    }],
     slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
}, { timestamps: true });

export const SubCategoryModel = mongoose.model('subCategory', subCategorySchema);
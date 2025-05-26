import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    name: {
        type: String,
        default: "",
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    categoryId: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ]
}, { timestamps: true });

export const SubCategoryModel = mongoose.model('subCategory', subCategorySchema);
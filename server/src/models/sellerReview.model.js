import {Schema, model} from 'mongoose'


const sellerReviewSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reviewer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
},{ timestamps: true})

sellerReviewSchema.index({seller: 1, reviewer: 1}, { unique: true}) // prevent reviewing same seller multiple times

export const SellerReviewModel = model("SellerReview", sellerReviewSchema);
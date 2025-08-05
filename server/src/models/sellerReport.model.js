import {Schema, model} from 'mongoose'

const sellerReportSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason:{
        type: String,
        required: true,
        enum: [
            'Spam or Scam',
            'Inappropriate Content',
            'Fraudlent Activity',
            'Other'
        ]
    },
    details: {
        type: String,
        trim: true
    },

    status:{
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    }
},{ timestamps: true})


export const SellerReportModel = model("SellerReport", sellerReportSchema)
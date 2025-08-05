import { Schema, Types, model } from 'mongoose'

const userReportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: [
            "Fake order / not receiving the item",
            "Abusive or threatening communication",
            "Frequent cancellations or returns with bad intent",
            "Fraudulent payment attempt",
            "Misusing return/refund system",
            "Requesting personal details or inappropriate contact",
            "Spamming or harassment",
            'Other'
        ]
    },
    details: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    }
}, { timestamps: true })


export const UserReportModel = model("UserReport", userReportSchema)
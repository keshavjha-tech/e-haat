import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: [true, "Full name is required."],
        trim: true
    },
    addressLine1 : {
        type : String,
        required: [true,"Required"],
        trim: true
    },
     addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, "City is required."],
        trim: true
    },
    state: {
        type: String,
        required: [true, "State is required."],
        trim: true
    },
    pinCode: {
        type: String,
        required: [true, "Postal code is required."],
        trim: true
    },
    country: {
        type: String,
        required: [true, "Country is required."],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required."],
        trim: true
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    isDefault: {
        type: Boolean,
        default: false
    }
},{timestamps : true})

export const AddressModel = mongoose.model("Address", addressSchema)
import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    address_line : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    state : {
        type : String,
        default : ""
    },
    pincode : {
        type : Number,
        default : ""
    },
    country : {
        type : String,
        default : ""
    },
    mobile : {
        type : Number,
        default : null
    }
},{timestamps : true})

export const AddressModel = mongoose.model("address", addressSchema)
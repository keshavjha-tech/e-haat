import mongoose, { Schema } from "mongoose";


//  This schema defines a single item within the shopping cart.
//  It will be embedded as a sub-document in the main Cart schema.
 
const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1."],
        default: 1
    }
});


 // This is the main Cart schema. 
 
const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true // Ensures one cart per user
    },
    items: [cartItemSchema] // An array of the items in the cart
}, { timestamps: true });


export const CartModel = mongoose.model("Cart", cartSchema);

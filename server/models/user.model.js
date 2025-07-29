import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide Password"],
        minLength: [8, "Password should be 8 characters long"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refreshToken: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Cart'
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],
    forget_password_otp: {
        type: String,
        default: null
    },
    forget_password_expiry: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ['USER', 'SELLER', 'ADMIN'],
        default: "USER"
    },

    // Seller specific

    store_name: {
        type: String,
        default: null
    },
    store_description: {
        type: String,
        default: null
    },
    sellerStatus: {
        type: String,
        default: 'Not Applied',
        enum: ['Not Applied', 'Waiting Approval', 'Rejected', 'Approved']
    },
     averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    products_listed: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
     reportCount: {
        type: Number,
        default: 0
    }
    
}, { timestamps: true })



userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

    // console.log("Comparing passwords...");
    // console.log("Input password:", password ? "provided" : "missing");
    // console.log("Stored hash exists:", !!this.password);
    // console.log("Stored hash length:", this.password ? this.password.length : 0);

    // const result = await bcrypt.compare(password, this.password);
    // console.log("Password comparison result:", result);
    // return result;
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

export const UserModel = mongoose.model("User", userSchema)
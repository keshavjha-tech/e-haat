import sendEmail from '../config/sendEmail.js';
import { UserModel } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';
import { generateAccessToken } from '../utils/generateAccessToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { generateOTP } from '../utils/generateOTP.js';
import { resetPasswordTemplate } from '../utils/resetPasswordTemplate.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

//Register Controller

const registerUserController = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await UserModel.findOne({ email })
    if (existedUser) {
        throw new ApiError(409, "User alredy existed")
    }

    const user = await UserModel.create({
        name, email, password
    })

    const createdUser = await UserModel.findById(user._id).select("-password")



    // const newUser = new UserModel(payload);
    // const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${user._id}`

    const verifyEmail = await sendEmail({
        sendTo: email,
        subject: "Verify email",
        html: verifyEmailTemplate({
            name,
            url: verifyEmailUrl
        })
    })

    if (!createdUser) {
        throw new ApiError(500, "Something when wrong during registration")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

//Email verification controller
 const verifyEmailController = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, { verify_email: true })
        return res.status(201).json({
            message: "email verified successfully",
            success: true,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Login controller 

 const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email || password)) {
            return res.status(400).json({
                message: "All feilds are required",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User doesn't exists.",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            })
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                error: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const loggedInUser = await UserModel.findById(user._id).select("-password");

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', accessToken, cookiesOption);
        res.cookie('refreshToken', refreshToken, cookiesOption);

        return res.status(200).json({
            message: "User Login Successfully",
            error: false,
            success: true,
            data: {
                // accessToken, refreshToken
                loggedInUser
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }

}

// Logout Controller
const logoutController = asyncHandler(async (req, res) => {

    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        }, {
        new: true
    });

    const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(200)
        .clearCookie("accessToken", cookiesOption)
        .clearCookie("refreshToken", cookiesOption)
        .json(new ApiResponse(200, {}, "User logged out succcessfully"))

}
)
//upolad user Avatar

 const uploadAvatar = asyncHandler(async (req, res) => {

    const userId = req.user._id //from auth middleware
    const image = req.file // from multer middleware

    const upload = await uploadOnCloudinary(image)

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
        avatar: upload.url
    })

    return res.json({
        message: "Profile Pic updated",
        data: {
            _id: userId,
            avatar: upload.url
        }
    })
})

// Update user details

 const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user._id
        const { name, email, mobile, password, avatar } = req.body

        let hashedPassword = ""
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashedPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashedPassword }),
            ...(avatar && { avatar: avatar }),
        })

        return res.status(200).json({
            message: "User updated",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Forgot password

 const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const otp = generateOTP();
        const expireOtp = new Date(Date.now() + 5 * 60 * 1000);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forget_password_otp: otp,
            forget_password_expiry: expireOtp
        })

        await sendEmail({
            sendTo: email,
            subject: "Reset Password",
            html: resetPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.json({
            message: "OTP sent to email",
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// verify otp

 const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!(email || otp)) {
            return res.status(400).json({
                message: "Provide required fields",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const currentTime = new Date();

        if (user.forget_password_expiry < currentTime) {
            return res.status(400).json({
                message: "OTP expires",
                error: true,
                success: false
            })
        }

        if (otp !== user.forget_password_otp) {
            return res.status(400).json({
                message: "Inavalid OTP",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forget_password_otp: "",
            forget_password_expiry: ""
        })

        return res.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Reset Password

 const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
            return res.status(400).json({
                message: "All Fields are required",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Both Password must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        const updatePassword = await UserModel.findOneAndUpdate({ _id: user._id }, {
            password: hashedPassword
        })

        return res.status(200).json({
            message: "Password Updated Successfully!!",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Refresh Token

 const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return res.status(401).json({
                message: "No refresh token provided",
                error: true,
                success: false
            })
        }

        const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

        if (!verifyToken) {
            return res.status(401).json({
                message: "Token is invalid or expired",
                success: false
            })
        }
        // console.log(verifyToken)

        const userId = verifyToken?._id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', newAccessToken, cookiesOption)

        return res.json({
            message: "New Access Token Generated",
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// get logedin user detail

 const userDetailsController = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await UserModel.findById(userId).select('-password -refresh_Token')

        return res.json({
            message: "User detail",
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

// apply to be seller

 const applyToBeSeller = asyncHandler(async (req, res) => {

    const { store_name, store_description } = req.body;
    const userId = req.user._id;

    //validate input
    if (!(store_name || store_description)) {
        throw new ApiError(400, "Store name and description are required")
    }

    //Find the user
    const user = await UserModel.findById(userId);

    if (user.sellerStatus === 'Approved' || user.sellerStatus === 'Waiting Approval') {
        throw new ApiError(400, `You cannot apply. Your current status id: ${user.sellerStatus}`);
    }

    user.store_name = store_name
    user.store_description = store_description
    user.sellerStatus = 'Waiting Approval'

    await user.save({ validateBeforeSave: false })

    return res.status(200, user, "Your seller application have been submitted")
})

export {
    registerUserController,
    logoutController,applyToBeSeller,userDetailsController,refreshToken,resetPassword,verifyOtp,forgotPasswordController,updateUserDetails,
    uploadAvatar,loginController,verifyEmailController
}
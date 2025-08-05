import sendEmail from '../config/sendEmail.js';
import { UserModel } from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { verifyEmailTemplate } from '../services/email.service/verifyEmailTemplate.js';
import { generateOTP } from '../services/otpService/generateOTP.js';
import { resetPasswordTemplate } from '../services/email.service/resetPasswordTemplate.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { UserReportModel } from '../models/userReport.model.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

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
const verifyEmailController = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
        throw new ApiError(400, 'Invalid verification code.')
    }

    if (user.verify_email) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Email is already verified.")
        );
    }

    await UserModel.updateOne({ _id: code }, { $set: { verify_email: true } })
    return res.status(200).json(
        new ApiResponse(200, {}, "Email veerified successfully.")
    )

})

// Login controller 

const loginController = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!(email || password)) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await UserModel.findOne({ email })

    console.log("Found User:", user ? "Yes" : "No");

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    if (user.status !== "Active") {
        throw new ApiError(400, "Inactive account.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials || Incorrect Password")
    }

    // const {accessToken} = await generateAccessToken(user._id);
    // const refreshToken = await generateRefreshToken(user._id)

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
        last_login_date: new Date()
    })

    const loggedInUser = await UserModel.findById(user._id).select("-password");

    const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(200)
        .cookie('accessToken', accessToken, cookiesOption)
        .cookie('refreshToken', refreshToken, cookiesOption)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User loggedIn successfully")
        )
})

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
        .json(new ApiResponse(200, {}, "User logged out successfully."))

}
)

// Update user details

const updateUserDetails = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const { name, email, mobile, password } = req.body

    const user = await UserModel.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    if (name) user.name = name
    if (email) user.email = email
    if (mobile) user.mobile = mobile

    if (password) {
        user.password = password
    }

    const updatedUser = await user.save({ validateBeforeSave: false })

    const returnUpdatedUser = await UserModel.findById(updatedUser._id).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200, returnUpdatedUser, "User updated successfully.")
    )
})

// Forgot password

const forgotPasswordController = asyncHandler(async (req, res) => {

    const { email } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    const otp = generateOTP();
    const expireOtp = new Date(Date.now() + 5 * 60 * 1000);

    await UserModel.findByIdAndUpdate(user._id, {
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

    return res.status(200).json(
        new ApiResponse(200, {}, "OTP has been sent to your email address.")
    )



})

// verify otp

const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body

    if (!(email || otp)) {
        throw new ApiError(400, "Provide required fields.")
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    const currentTime = new Date();

    if (user.forget_password_expiry < currentTime) {
        throw new ApiError(400, "OTP expired.")
    }

    if (otp !== user.forget_password_otp) {
        throw new ApiError(400, "Invalid OTP.")
    }

    await UserModel.findByIdAndUpdate(user?._id, {
        forget_password_otp: "",
        forget_password_expiry: ""
    })

    return res.status(200).json(
        new ApiResponse(200, {}, "OTP verified successfully.")
    )
})

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (
        [email, newPassword, confirmPassword].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do no match.")
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found.")
    }

    const isSamePassword = await user.isPasswordCorrect(newPassword)
    if (isSamePassword) {
        throw new ApiError(400, "New password cannot be same as old password.")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "Password has been reset successfully.")
    )
})


//Refresh Access Token

const refreshAccessToken = asyncHandler(async (req, res) => {

    //  console.log("EXECUTING THE NEW 'refreshAccessToken' FUNCTION");

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken || req?.headers?.authorization?.split(" ")[1]

    // console.log("incoming token ", incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized request: No token provided.")
    }

    
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY
        );

        // console.log("deoded token", decodedToken)

        const user = await UserModel.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found.")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired or has been used.");
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        // user.refreshToken = newRefreshToken;
        // await user.save({ validateBeforeSave: false })

         return res
        .status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 5 * 60 * 1000 }) 
        .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }) 
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully."));
})


// get logedin user detail

const userDetailsController = async (req, res) => {
    try {
        const userId = req.user?._id

        const user = await UserModel.findById(userId).select('-password -refreshToken')

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
    const userId = req.user?._id;

    //validate input
    if (!store_name || !store_description) {
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

    return res.status(200).json(
        new ApiResponse(200, user, "Your seller application have been submitted")
    )
})

const reportUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const reporterID = req.user._id
    const { reason, details } = req.body

    if (userId === reporterID.toString()) {
        throw new ApiError(403, "You cannot report yourself.")
    }

    if (!reason) {
        throw new ApiError(400, "A reason for the report is required.");
    }

    const report = await UserReportModel.create({
        user: userId,
        reporter: reporterID,
        reason,
        details
    })
    if (!report) {
        throw new ApiError(500, "Failed to submit the report. Please try again.");
    }

    return res.status(201).json(
        new ApiResponse(201, report, "Report user successfully")
    )
})

export {
    registerUserController,
    logoutController,
    applyToBeSeller,
    userDetailsController,
    refreshAccessToken,
    resetPassword,
    verifyOtp,
    forgotPasswordController,
    updateUserDetails,
    loginController,
    verifyEmailController,
    reportUser
}
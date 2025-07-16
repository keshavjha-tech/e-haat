import sendEmail from '../config/sendEmail.js';
import {UserModel} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';
import { generateAccessToken } from '../utils/generateAccessToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { generateOTP } from '../utils/generateOTP.js';
import { resetPasswordTemplate } from '../utils/resetPasswordTemplate.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config'

//Register Controller

export async function registerUserController(req, res) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message : "all fields are required",
                error: true,
                success : false
            })
        }

        const existedUser = await UserModel.findOne({email})
        if(existedUser){
            return res.status(409).json({
                message : "User with email already exists",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(16);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const payload = {
            name, 
            email, 
            password : hashedPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email",
            html : verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })

        return res.status(200).json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//Email verification controller
export async function verifyEmailController (req, res) {
    try {
        const {code} = req.body;
        const user = await UserModel.findOne({_id : code});

        if(!user){
            return res.status(400).json({
                message : "Invalid Code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({_id : code}, {verify_email : true})
        return res.status(201).json({
            message : "email verified successfully",
            success : true,
            error : false,
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Login controller 

export async function loginController(req, res) {
    try {
        const {email, password} = req.body;
        
        if(!(email || password)){
            return res.status(400).json({
                message : "All feilds are required",
                error : true,
                 success : false
            })
        }

        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "User doesn't exists.",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return res.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message : "Invalid credentials",
                error : true,
                success : false
            })
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const loggedInUser = await UserModel.findById(user._id).select("-password");

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken', accessToken, cookiesOption);
        res.cookie('refreshToken', refreshToken, cookiesOption);
        
            return res.status(200).json({
                message : "User Login Successfully",
                error : false,
                success : true,
                data : {
                    accessToken, refreshToken
                }
            })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }

}

// Logout Controller

export async function logoutController(req, res) {
    try {
        const userId = req.userId // from middleware
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_Token : ""
        })

        return res.json({
            message : "User logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upolad user Avatar

export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId //from auth middleware
        const image = req.file // from multer middleware

        const upload = await uploadOnCloudinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar : upload.url
        })

        return res.json({
            message : "Profile Pic updated",
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }
}

// Update user details

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId
        const{name, email, mobile, password, avatar } = req.body

        let hashedPassword = ""
        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashedPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId}, {
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(mobile && {mobile : mobile}),
            ...(password && {password : hashedPassword}),
            ...(avatar && {avatar : avatar}),
        })

        return res.status(200).json({
            message : "User updated",
            error: false,
            success: true,
            data : updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Forgot password

export async function forgotPasswordController(req, res) {
    try {
        const {email} = req.body

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(404).json({
                message : "User not found",
                error : true,
                success : false
            })
        }

        const otp = generateOTP();
        const expireOtp = new Date(Date.now() + 5 * 60 * 1000);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forget_password_otp : otp,
            forget_password_expiry: expireOtp
        })

        await sendEmail({
            sendTo : email,
            subject : "Reset Password",
            html : resetPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.json({
            message : "OTP sent to email",
            error : false,
            success : true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

// verify otp

export async function verifyOtp(req, res){
    try {
        const {email, otp} = req.body

        if(!(email || otp)){
            return res.status(400).json({
                message : "Provide required fields",
                error : true,
                success :false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(404).json({
                message : "User not found",
                error : true,
                success : false
            })
        }

        const currentTime = new Date();

        if(user.forget_password_expiry < currentTime){
           return res.status(400).json({
                message : "OTP expires",
                error : true,
                success : false
            })
        }

        if(otp !== user.forget_password_otp){
            return res.status(400).json({
                message :"Inavalid OTP",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forget_password_otp : "",
            forget_password_expiry : ""
        })

        return res.json({
            message : "OTP verified successfully",
            error : false,
            success : true
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Reset Password

export async function resetPassword(req, res) {
    try {
        const {email, newPassword, confirmPassword} = req.body;

        if(!email?.trim() || !newPassword?.trim() || !confirmPassword?.trim()){
            return res.status(400).json({
                message : "All Fields are required",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "User not found",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "Both Password must be same",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        const updatePassword = await UserModel.findOneAndUpdate({ _id: user._id },{
            password : hashedPassword
        })

        return res.status(200).json({
            message : "Password Updated Successfully!!",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//Refresh Token

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if(!refreshToken){
            return res.status(401).json({
                message : "No refresh token provided",
                error : true,
                success : false
            })
        }
        
        const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

        if(!verifyToken){
            return res.status(401).json({
                message : "Token is invalid or expired",
                success : false
            })
        }
        // console.log(verifyToken)

        const userId = verifyToken?._id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken', newAccessToken, cookiesOption)

        return res.json({
            message : "New Access Token Generated",
            success : true,
            data :{
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// get logedin user detail

export async function userDetailsController(req, res){
    try {
        const userId = req.userId

        const user = await UserModel.findById(userId).select('-password -refresh_Token')

        return res.json({
            message : "User detail",
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}
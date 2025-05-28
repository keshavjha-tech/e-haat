import sendEmail from '../config/sendEmail.js';
import {UserModel} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';
import { generateAccessToken } from '../utils/generateAccessToken.js';

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
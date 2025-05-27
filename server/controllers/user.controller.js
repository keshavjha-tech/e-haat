import sendEmail from '../config/sendEmail.js';
import {UserModel} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';

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
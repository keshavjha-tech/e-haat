import {Router} from 'express'
import 
{loginController,
    logoutController,
    registerUserController,
    updateUserDetails,
    uploadAvatar,
    forgotPasswordController,
    verifyEmailController,
    verifyOtp,
    resetPassword,
    refreshToken} 
from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';


const userRouter = Router();

// userRouter.post('/register', registerUserController)

userRouter.route('/register').post(registerUserController);
userRouter.route('/verify-email').post(verifyEmailController);
userRouter.route('/login').post(loginController);
userRouter.route('/logout').get(verifyJWT,logoutController);
userRouter.route('/upload-avatar').put(verifyJWT, upload.single('avatar'), uploadAvatar)
userRouter.route('/update-user').put(verifyJWT, updateUserDetails)
userRouter.route('/forgot-password').put(forgotPasswordController)
userRouter.route('/verify-forgot-password-otp').put(verifyOtp)
userRouter.route('/reset-password').put(resetPassword)
userRouter.route('/refresh-token').post(refreshToken);

export default userRouter
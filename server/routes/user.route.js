import {Router} from 'express'
import 
{loginController,
    logoutController,
    registerUserController,
    uploadAvatar,
    verifyEmailController} 
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

export default userRouter
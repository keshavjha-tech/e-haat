import {Router} from 'express'
import 
{loginController,
    logoutController,
    registerUserController,
    verifyEmailController} 
from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';


const userRouter = Router();

// userRouter.post('/register', registerUserController)

userRouter.route('/register').post(registerUserController);
userRouter.route('/verify-email').post(verifyEmailController);
userRouter.route('/login').post(loginController);
userRouter.route('/logout').get(verifyJWT,logoutController);

export default userRouter
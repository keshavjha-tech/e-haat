import {Router} from 'express'
import 
{registerUserController, verifyEmailController} 
from '../controllers/user.controller.js'

const userRouter = Router();

// userRouter.post('/register', registerUserController)

userRouter.route('/register').post(registerUserController);
userRouter.route('/verify-email').post(verifyEmailController);
userRouter.route('/login').post(loginController);

export default userRouter
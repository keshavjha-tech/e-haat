import { Router } from 'express'
import {
    applyToBeSeller,
    forgotPasswordController,
    loginController,
    logoutController,
    refreshToken,
    registerUserController,
    reportUser,
    resetPassword,
    updateUserDetails,
    userDetailsController,
    verifyEmailController,
    verifyOtp
}
    from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
import {upload} from '../middleware/multer.middleware.js';
import { authorizeRole } from '../middleware/roles.middleware.js';


const userRouter = Router();

// userRouter.post('/register', registerUserController)

userRouter.route('/register').post(registerUserController);
userRouter.route('/verify-email').post(verifyEmailController);
userRouter.route('/login').post(loginController);
userRouter.route('/logout').get(verifyJWT, logoutController);
userRouter.route('/update-user').put(verifyJWT, updateUserDetails)
userRouter.route('/forgot-password').put(forgotPasswordController)
userRouter.route('/verify-forgot-password-otp').put(verifyOtp)
userRouter.route('/reset-password').put(resetPassword)
userRouter.route('/refresh-token').post(refreshToken);
userRouter.route('/user-detail').get(verifyJWT, userDetailsController);
userRouter.route('/apply-seller').put(verifyJWT, applyToBeSeller)
userRouter.route('/:userId/report').post(verifyJWT, authorizeRole('SELLER'), reportUser)

export default userRouter
import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
    createRazorpayOrder,
    verifyPayment,
    getPaymentStatus
} from '../controllers/payment.controller.js';

const paymentRouter = Router();

// All payment routes require authentication
paymentRouter.use(verifyJWT);

paymentRouter.route('/create-order').post(createRazorpayOrder);
paymentRouter.route('/verify').post(verifyPayment);
paymentRouter.route('/status/:orderId').get(getPaymentStatus);

export default paymentRouter;


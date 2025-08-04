import { Router } from 'express'
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrdeItemStatus
} from '../controllers/order.controller';

const orderRouter = Router();

// All corder routes require a user to be logged in
orderRouter.use(verifyJWT)

orderRouter.route('/').post(createOrder)
orderRouter.route('/my-orders').get(getMyOrders)
orderRouter.route('/:id').get(getOrderById)

// seller or admin routes
orderRouter.route('/:orderId/item/:itemId')
    .put(authorizeRole('ADMIN', 'SELLER'), updateOrdeItemStatus)


export default orderRouter;
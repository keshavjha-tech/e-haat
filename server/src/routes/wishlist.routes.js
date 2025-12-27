import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlistStatus
} from '../controllers/wishlist.controller.js';

const wishlistRouter = Router();

// All wishlist routes require authentication
wishlistRouter.use(verifyJWT);

wishlistRouter.route('/').get(getWishlist);
wishlistRouter.route('/add').post(addToWishlist);
wishlistRouter.route('/remove/:productId').delete(removeFromWishlist);
wishlistRouter.route('/check/:productId').get(checkWishlistStatus);

export default wishlistRouter;


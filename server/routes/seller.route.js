import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { createSellerReview, reportSeller, updateSellerReview } from '../controllers/sellerReviewAndReport.controller.js';

const sellerRouter = Router();

sellerRouter.route('/:sellerId/review').post(verifyJWT, createSellerReview)
sellerRouter.route('/review/:reviewId').put(verifyJWT, updateSellerReview)
sellerRouter.route('/:sellerId/report').post(verifyJWT, reportSeller)

export default sellerRouter
import { SellerReviewModel } from '../models/sellerReview.model.js'
import { UserModel } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { SellerReportModel } from '../models/sellerReport.model.js'

const createSellerReview = asyncHandler(async (req, res) => {
    const { sellerId } = req.params
    const { rating, comment } = req.body
    const reviewerId = req.user._id

    //Mongodb returns id in object so we have to covert it into string for comparision
    if (sellerId === reviewerId.toString()) {
        throw new ApiError(400, "You cannot review yourself.")
    }

    // create a new review
    const review = await SellerReviewModel.create({
        seller: sellerId,
        reviewer: reviewerId,
        rating,
        comment
    })

    // update seller avg rating
    const seller = await UserModel.findById(sellerId)

    const newRatingCount = seller.ratingCount + 1
    const newAverageRating = ((seller.averageRating * seller.ratingCount) + rating) / newRatingCount

    seller.averageRating = newAverageRating.toFixed(2)
    seller.ratingCount = newRatingCount

    await seller.save({ validateBeforeSave: false })

    return res.status(201).json(
        new ApiResponse(201, review, "Review submitted successfully")
    )
})

const updateSellerReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const currentUserId = req.user._id;

    const review = await SellerReviewModel.findById(reviewId);
    if (!review) { throw new ApiError(404, "Review not found."); }

    if (review.reviewer.toString() !== currentUserId.toString()) {
        throw new ApiError(403, "You are not authorized to update this review.");
    }

    const seller = await UserModel.findById(review.seller);
    const oldRating = review.rating;

    // Recalculate average using top-level fields
    const totalRatingSum = (seller.averageRating * seller.ratingCount) - oldRating + rating;
    const newAverageRating = totalRatingSum / seller.ratingCount;

    // Update seller's top-level fields
    seller.averageRating = newAverageRating.toFixed(2);
    await seller.save({ validateBeforeSave: false });

    review.rating = rating;
    review.comment = comment;
    const updatedReview = await review.save();

    return res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully."));
});

const reportSeller = asyncHandler(async(req, res)=>{
    const {sellerId }= req.params
    const { reason, details } = req.body
    const  reporterId  = req.user._id

     if (!reason) {
        throw new ApiError(400, "A reason for the report is required.");
    }

    if (sellerId === reporterId.toString()) {
        throw new ApiError(400, "You cannot report yourself.");
    }

   const report = await SellerReportModel.create({
        seller: sellerId,
        reporter: reporterId,
        reason,
        details
    })

    return res.status(201).json(
        new ApiResponse(201, report, "Report has been submitted")
    )
})
export { createSellerReview, updateSellerReview, reportSeller}
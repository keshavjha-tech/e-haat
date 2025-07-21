import {UserModel} from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { sellerApprovedTemplate } from '../utils/sellerApprovedTemplate.js';
import { sellerRejectedTemplate } from '../utils/sellerRejectedTemplate.js';

// user who applied to be a seller

export const getPendingSellers = asyncHandler(async(req, res)=>{

    const pendingSellers = await UserModel.find({
        sellerStatus : "Waiting Approval"
    }).select("-password -refreshToken")
    
    if(!pendingSellers || pendingSellers.length === 0){
     return res.status(200).json(
        new ApiResponse(200, [], "No pending sellers application found")
     )
    }

     return res.status(200).json(
        new ApiResponse(200, pendingSellers, "Pending sellers application retrieved successfully")
     )
})

export const approveSeller = asyncHandler(async(req, res) => {
    const { sellerId } =  req.params

    const user = await UserModel.findById(sellerId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    user.role = 'SELLER'
    user.sellerStatus = 'Approved'
    await user.save({ validateBeforeSave: false })


    // Notification ---
    try {
        await sendEmail({
            sendTo: user.email,
            subject: "Your Seller Application has been Approved!",
            html: sellerApprovedTemplate({ name: user.name })
        });
    } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        // Do not block the main response, just log the email error
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Seller has been approved successfully")
    )
})

export const rejectSeller = asyncHandler(async(req, res) => {
    const { sellerId } = req.params

    const user =await UserModel.findById(sellerId)
    if(!user){
        throw new ApiError(404, "User Not Found.")
    }

    user.sellerStatus = 'Rejected'
    await user.save({ validateBeforeSave: false })

      try {
        await sendEmail({
            sendTo: user.email,
            subject: "Update on Your Seller Application",
            html: sellerRejectedTemplate({ name: user.name })
        });
    } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Your application have been rejected")
    )
})



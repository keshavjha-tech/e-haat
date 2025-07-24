import { UserModel } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { sellerApprovedTemplate } from '../utils/sellerApprovedTemplate.js';
import { sellerRejectedTemplate } from '../utils/sellerRejectedTemplate.js';
import { SellerReportModel } from '../models/sellerReport.model.js';
import { ProductModel } from '../models/product.model.js';
import { UserReportModel } from '../models/userReport.model.js';
import { accountSuspendedTemplate } from '../utils/accountSuspendedTemplate.js';
import { accountReactivatedTemplate } from '../utils/accountReactivatedTemplate.js';

// user who applied to be a seller

const getPendingSellers = asyncHandler(async (req, res) => {

    const pendingSellers = await UserModel.find({
        sellerStatus: "Waiting Approval"
    }).select("-password -refreshToken")

    if (!pendingSellers || pendingSellers.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No pending sellers application found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, pendingSellers, "Pending sellers application retrieved successfully")
    )
})

const approveSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params

    const user = await UserModel.findById(sellerId)
    if (!user) {
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
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Seller has been approved successfully")
    )
})

const rejectSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params

    const user = await UserModel.findById(sellerId)
    if (!user) {
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

const getPendingReports = asyncHandler(async (req, res) => {
    const pendingReports = await SellerReportModel.find({
        status: "Pending"
    })
    if (!pendingReports || pendingReports.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No Reports")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, pendingReports, "Pending reports fetched")
    )
})

const reviewReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params

    const report = await SellerReportModel.findByIdAndUpdate(
        reportId,
        { status: 'Reviewed' },
        { new: true }
    )
    if (!report) {
        throw new ApiError(404, "Report not found.")
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report status updated to reviewed")
    )
})

const resolveReport = asyncHandler(async (req, res) => {

    const { reportId } = req.params
    const REPORT_THRESHOLD = 20

    const report = await SellerReportModel.findByIdAndUpdate(
        reportId,
        { status: 'Resolved' },
        { new: true }
    )

    if (!report) {
        throw new ApiError(404, "Report not found")
    }

    const seller = await UserModel.findById(report.seller);
    seller.reportCount += 1;
    await seller.save({ validateBeforeSave: false })

    if(seller.reportCount >= REPORT_THRESHOLD){
        seller.status = 'Suspended',
        await seller.save({validateBeforeSave: false})

        await ProductModel.updateMany(
            { seller: seller._id},
            {publish: false}
        )

        await sendEmail({
            sendTo: seller.email,
            subject: "Urgent: Your seller account has been suspended",
            html: accountSuspendedTemplate({name: seller.name})
        })

        return res.status(200).json(
            new ApiResponse(200, {report, seller}, "Report resolve. Seller Account has been suspended due to multiple violations.")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, report, "Report has been resolved and closed.")
    )

})

const reactivateSeller = asyncHandler(async(req, res)=>{
    const { sellerId} = req.params

    const seller = UserModel.findById(sellerId)
    if(!seller){
        throw new ApiError(404, "Seller not found.")
    }

    if(seller.status !== 'Suspended'){
        throw new ApiError(400, "This seller is not currently suspended.")
    }

    seller.status = 'Active';
    seller.reportCount = 0;
    await seller.save({ validateBeforeSave: false})

    await ProductModel.updateMany(
        { seller: sellerId},
        {Publish: true}
    )

    await sendEmail({
        sendTo: sellerId,
        subject: "Your seller account has been Reactivated",
        html: accountReactivatedTemplate({name: seller.name})
    })
})


const getPendingUserReports = asyncHandler(async (req, res) => {
    const pendingReports = await UserReportModel.find({
        status: "Pending"
    })
    if (!pendingReports || pendingReports.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No Reports")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, pendingReports, "Pending reports fetched")
    )
})

const reviewUserReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params

    const report = await UserReportModel.findByIdAndUpdate(
        reportId,
        { status: 'Reviewed' },
        { new: true }
    )
    if (!report) {
        throw new ApiError(404, "Report not found.")
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report status updated to reviewed")
    )
})

export {
    getPendingSellers,
    approveSeller,
    rejectSeller,
    getPendingReports,
    reviewReport,
    resolveReport,
    reactivateSeller,
    getPendingUserReports,
    reviewUserReport
}


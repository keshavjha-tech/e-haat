import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'


// export const isAdmin = asyncHandler( async(req, _, next) => {

//     if(req.user?.role !== 'ADMIN'){
//         throw new ApiError(403, "Permision denied. Admin access required")
//     }
//     next();

// })

// export const isVerifiedSeller = asyncHandler(async(req, _, next) =>{

//     if(req.user?.role !== 'SELLER'){
//         throw new ApiError(403, "Permission denied. You must me an approved seller.")
//     }
//     next();

// })

export const authorizeRole = (...roles) => {
    return (req, _, next) => {
        // This middleware assumes isAuthenticatedUser has already run.
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Role: ${req.user.role} is not allowed to access this resource.`
            );
        }
        next();
    }
}
import {UserModel} from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'


export const admin = asyncHandler( async(req, res, next) => {

    const userId = req.userId;

    const user = await UserModel.findById(userId)

    if(user.role !== 'ADMIN'){
        throw new ApiError(401, "Permision denial || Unauthorizes Access")
    }

    next();

})
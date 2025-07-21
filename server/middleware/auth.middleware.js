import { UserModel } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

export const verifyJWT =async(req, res, next) => {
try {
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]    // ["Bearer", "token"]
    // console.log(" Access Token Received:", token);

    if(!token){
       throw new ApiError(401, "Unauthorizes Request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)

    const user = await UserModel.findById(decodedToken?._id)

    if(!user){
         throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user
    //  console.log("Authenticated User:", req.user)

    next();

} catch (error) {
       if (error instanceof jwt.JsonWebTokenError) { // Catches TokenExpiredError, etc.
            return next(new ApiError(401, error?.message || "Invalid access token."));
        }
        // Pass any other errors to the next error-handling middleware
        return next(error);
    }

   
}


import jwt from "jsonwebtoken"

export const verifyJWT =async(req, res, next) => {
try {
    const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]    // ["Bearer", "token"]
    // console.log(" Access Token Received:", token);

    if(!token){
        return res.status(401).json({
            message : "Token missing",
            error : true,
            success: false
        })
    }

    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)

    if(!decode){
        return res.status(401).json({
            message : "Unauthorized access",
            error : true,
            success : false
        })
    }

    req.userId = decode.id

    next();

} catch (error) {
     if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: error.message,
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    })
}
}
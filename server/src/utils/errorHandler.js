import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {

    console.error("ERROR HANDLER CAUGHT:", err);
    console.error("Error Stack:", err.stack);

    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    // For unexpected errors
    return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong on the server.",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export { errorHandler };
import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
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
        message: "Something went wrong on the server."
    });
};

export { errorHandler };
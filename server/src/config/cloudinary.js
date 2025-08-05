import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../utils/ApiError.js'; 


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadOnCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            return reject(new ApiError(400, "File buffer is missing."));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "e-haat", 
                resource_type: "auto" 
            },
            (error, result) => {
                if (error) {
                    // If Cloudinary returns an error, reject the promise
                    console.error("Cloudinary Upload Error:", error);
                    return reject(new ApiError(500, "Failed to upload file to Cloudinary."));
                }
                // If successful, resolve the promise with the result
                resolve(result);
            }
        );

        // Send the buffer to the upload stream
        uploadStream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // Corrected to use the 'publicId' parameter
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        //  throw the error- handled by global error handler
        throw new ApiError(500, "Failed to delete file from Cloudinary.");
    }
};
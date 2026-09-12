import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("Provide MONGODB_URI environment variable");
    }
    try {
        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
}

export default connectDB
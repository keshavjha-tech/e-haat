import dotenv from 'dotenv';
import connectDB from './config/connection.js';
import { app } from './app.js';


dotenv.config();



const port = process.env.PORT || 8080

//connection
connectDB()
    .then(() => {
        app.on("error", (error) => { // Added 'error' parameter
            console.log("SERVER ERROR: ", error);
            throw error;
        });
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed: ", err);
    });
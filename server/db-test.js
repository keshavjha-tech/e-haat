import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load only the .env.test file
dotenv.config({ path: '.env.test' });

const uri = process.env.MONGODB_TEST_URI;

if (!uri) {
    console.error(" MONGODB_TEST_URI not found in .env.test file!");
    process.exit(1);
}

console.log("Attempting to connect to:", uri.replace(/:([^:]+)@/, ':****@')); 

mongoose.connect(uri)
    .then(() => {
        console.log(" Successfully connected to the database!");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(" Connection failed!");
        console.error(err);
    });
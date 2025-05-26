import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Provide Name"]
    },
    email : {
        type : String,
        required : [true, "Provide email"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "Provide Password"],
        minLength : [8, "Password should be 8 characters long"]
    },
    avatar : {
        type : String,
        default : ""
    },
    mobile : {
        type : number,
        default : null
    },
    refresh_token : {
        type : String,
        default : ""
    }
})
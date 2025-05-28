import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet'
import connectDB from './config/connection.js';
import userRouter from './routes/user.route.js';

dotenv.config();

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
console.log("Allowed CORS Origin:",  process.env.FRONTEND_URL);

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

const port = process.env.PORT || 8080

app.get("/", (req, res) => {
    res.json({
        message: " server is running"
    })
})

app.use('/api/user', userRouter)
console.log("Secret:", process.env.ACCESS_TOKEN_SECRET_KEY);

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server is running on ", port)
    })
})


import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/connection.js';

const app = express();

dotenv.config();

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
console.log("Allowed CORS Origin:", process.env.FRONTEND_URL);

//connection
const port = process.env.PORT || 8080
connectDB()
    .then(() => {
        app.on("error", () => {
            console.log("err", error);
            throw error
        })
        app.listen(port, () => {
            console.log("Server is running on ", port)
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed");

    })


//routes
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.routes.js';
import sellerRouter from './routes/seller.route.js';
import categoryRouter from './routes/category.routes.js';
import subCategoryRouter from './routes/subCategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import addressRouter from './routes/address.routes.js';


//routes decleration
app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/seller', sellerRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/sub-category', subCategoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/address', addressRouter)

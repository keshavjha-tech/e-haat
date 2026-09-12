import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import morgan from 'morgan';

const app = express();

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ""))
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
}))
console.log("Allowed CORS Origins:", allowedOrigins);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});



//routes
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.routes.js';
import sellerRouter from './routes/seller.route.js';
import categoryRouter from './routes/category.routes.js';
import subCategoryRouter from './routes/subCategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import addressRouter from './routes/address.routes.js';
import orderRouter from './routes/order.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import paymentRouter from './routes/payment.routes.js';
import { errorHandler } from './utils/errorHandler.js';


//routes decleration
app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/seller', sellerRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/sub-category', subCategoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/wishlist', wishlistRouter)
app.use('/api/v1/payment', paymentRouter)

app.use(errorHandler)
export {app}
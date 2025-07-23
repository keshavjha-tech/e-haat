import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addItemToCart } from "../controllers/cart.controller.js";

const cartRouter = Router()

// All cart routes require a user to be logged in
cartRouter.use(verifyJWT)


cartRouter.route('/add').post(addItemToCart)

export default cartRouter
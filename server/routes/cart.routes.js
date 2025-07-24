import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    addItemToCart,
    clearCart,
    getCart,
    removeItemFromCart,
    updateCartItemQuantity
} from "../controllers/cart.controller.js";

const cartRouter = Router()

// All cart routes require a user to be logged in
cartRouter.use(verifyJWT)

cartRouter.route('/').get(getCart)
cartRouter.route('/add').post(addItemToCart)
cartRouter.route("/update-quantity").put(updateCartItemQuantity);
cartRouter.route("/remove/:productId").delete(removeItemFromCart);
cartRouter.route("/clear").delete(clearCart);

export default cartRouter
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {
    addAddress,
    deleteAddress,
    getMyAddresses,
    updateAddress
} from "../controllers/address.controller.js"

const addressRouter = Router()
addressRouter.use(verifyJWT)

addressRouter.route("/").get(getMyAddresses).post(addAddress)
addressRouter.route("/:addressId").put(updateAddress).delete(deleteAddress)

export default addressRouter
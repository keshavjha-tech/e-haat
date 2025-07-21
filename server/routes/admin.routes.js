import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/admin.middleware.js";
import { approveSeller, getPendingSellers, rejectSeller } from "../controllers/admin.controller.js";




const adminRouter = Router()

adminRouter.use(verifyJWT, admin)

adminRouter.route('/pending-seller').get(getPendingSellers)
adminRouter.route('/approve-seller/:sellerId').get(approveSeller)
adminRouter.route('/reject-seller/:sellerId').get(rejectSeller)


export default adminRouter
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { approveSeller, getPendingReports, getPendingSellers, reactivateSeller, rejectSeller, resolveReport, reviewReport } from "../controllers/admin.controller.js";
import { authorizeRole } from "../middleware/roles.middleware.js";




const adminRouter = Router();

adminRouter.use(verifyJWT, authorizeRole('ADMIN'));

adminRouter.route('/pending-seller').get(getPendingSellers);
adminRouter.route('/approve-seller/:sellerId').put(approveSeller);
adminRouter.route('/reject-seller/:sellerId').put(rejectSeller);
adminRouter.route('/reports/pending').get(getPendingReports);
adminRouter.route('/reports/review/:reportId').put(reviewReport);
adminRouter.route('/reports/resolve/:reportId').put(resolveReport);
adminRouter.route('/reactivate-seller/:sellerId').put(reactivateSeller);


export default adminRouter
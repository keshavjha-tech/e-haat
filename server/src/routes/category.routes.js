import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategory,
    updateCategory
} from "../controllers/category.controller.js";

const categoryRouter = Router();

//public routes
categoryRouter.route('/').get(getAllCategory);
categoryRouter.route('/:slugOtId').get(getCategory);


// admin accessed routes only

categoryRouter.use(verifyJWT, authorizeRole('ADMIN'))

categoryRouter.route("/").post(upload.single('image'), createCategory)
categoryRouter.route("/:categoryId").put(upload.single('image'), updateCategory).delete(deleteCategory)

export default categoryRouter
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { createCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/").post(verifyJWT, authorizeRole('ADMIN'), upload.single('image'), createCategory)
import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    createSubCategory,
    deleteSubCategory,
    getAllSubCategories,
    getSubCategoriesForCategory,
    updateSubCategory

} from '../controllers/subCategory.controller.js';


const subCategoryRouter = Router()

subCategoryRouter.route('/category/:categoryId').get(getSubCategoriesForCategory)

// admin specific route

subCategoryRouter.use(verifyJWT, authorizeRole('ADMIN'))

subCategoryRouter.route('/')
    .get(getAllSubCategories)
    .post(upload.single('image'), createSubCategory)

subCategoryRouter.route('/:subCategoryId')
    .put(upload.single('image'), updateSubCategory)
    .delete(deleteSubCategory);


export default subCategoryRouter
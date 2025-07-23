import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    updateProduct

} from '../controllers/product.controller.js';


const productRouter = Router()

//seller product route
productRouter.route('/my-products').get(verifyJWT, authorizeRole('SELLER') ,getMyProducts)

//Public routes
productRouter.route('/').get(getAllProducts)
productRouter.route('/:productId').get(getProductById)

// CRUD route

productRouter.use(verifyJWT, authorizeRole('SELLER'))


productRouter.route('/').post(upload.array('images', 5), createProduct)
productRouter.route('/:productId')
    .put(upload.array('images', 5), updateProduct)
    .delete(deleteProduct)



export default productRouter
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from '../controllers/productController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.post('/product/new', isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.put('/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.get('/product/:id', getProductDetails);

export default router;

import express from 'express';
import { createProduct, createProductReview, deleteProduct, deleteReview, getAllProducts, getProductDetails, getProductReviews, updateProduct } from '../controllers/productController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.get('/admin/product/:id', getProductDetails);
router.get('/product/:id', getProductDetails);
router.put('/review', isAuthenticatedUser, createProductReview);
router.get('/reviews', getProductReviews);
router.get('/reviews', isAuthenticatedUser, deleteReview);

export default router;

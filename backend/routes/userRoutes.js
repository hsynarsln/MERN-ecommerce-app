import express from 'express';
import { deleteUser, forgotPassword, getAllUser, getUser, getUserDetails, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile, updateUserRole } from '../controllers/userController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUser);
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), getUser);
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

export default router;

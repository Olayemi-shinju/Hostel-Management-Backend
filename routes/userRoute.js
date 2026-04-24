import express from 'express';

import { deleteUser, forgotPassword, getAllAdmins, getAllUser, getSingleUser, login, logOut, Register, resendVerificationCode, resetPassword, updateData, verifyEmail } from '../controllers/UserController.js';
import { protect, authorized } from '../middlewares/authMiddleware.js';
import { adminLimiter, forgotPasswordLimiter, loginLimiter, otpLimiter, userLimiter } from '../middlewares/authLimiter.js';
const router = express.Router();

router.post('/register', Register);
router.post('/login', loginLimiter, login);
router.post('/verify-email', otpLimiter, verifyEmail);
router.post('/resend-verification-code', otpLimiter, resendVerificationCode);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/log-out', logOut);
router.get('/admins', protect, authorized('super-admin'), adminLimiter, getAllAdmins);
router.get('/users', protect, authorized('super-admin'), userLimiter, getAllUser);
router.get('/user/:id', protect, authorized('super-admin'), getSingleUser);
router.put('/update-user', protect, updateData);
router.delete('/delete/:id', protect, authorized("super-admin"), adminLimiter, deleteUser)

export default router
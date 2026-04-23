import express from 'express';

import {deleteUser, forgotPassword, getAllAdmins, getAllUser, getSingleUser, login, logOut, Register, resendVerificationCode, resetPassword, updateData, verifyEmail} from '../controllers/UserController.js';
import {protect, authorized} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', Register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-code', resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/log-out', logOut);
router.get('/admins', protect, authorized('super-admin'), getAllAdmins);
router.get('/users', protect, authorized('super-admin'), getAllUser);
router.get('/user/:id', protect, authorized('super-admin'), getSingleUser);
router.put('/update-user', protect, updateData);
router.delete('/delete/:id', protect, authorized("super-admin"), deleteUser)

export default router
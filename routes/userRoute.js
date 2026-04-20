import express from 'express'
import { login, Register, verifyEmail, resendVerificationCode, resetPassword, forgotPassword, getAllAdmins, getAllUser, getSingleUser } from '../controllers/UserController.js'
import {authorized} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', Register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-code', resendVerificationCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/admins', authorized('super-admin'), getAllAdmins)
router.get('/users', authorized('super-admin'),getAllUser)
router.get('/user/:id', authorized('super-admin'),getSingleUser)

export default router

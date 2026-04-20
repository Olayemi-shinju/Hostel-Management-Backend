const router = express.Router()

router.post('/register', Register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-code', resendVerificationCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/log-out', logOut)
router.get('/admins', protect, authorized('super-admin'), getAllAdmins)
router.get('/users', protect, authorized('super-admin'), getAllUser)
router.get('/user/:id', protect, authorized('super-admin'), getSingleUser)

export default router
import express from 'express'
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth
} from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)
router.post('/signup', signup)
router.post('/login', login)
router.put('/verify-email', verifyEmail)
router.delete('/logout', logout)
router.put('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

// Define routes
export default router

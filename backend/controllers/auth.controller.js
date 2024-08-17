import bcryptjs from 'bcryptjs'
import { User } from '../modals/user.modal.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import {
  sendEmailWelcome,
  sendResetEmailSuccess,
  sendResetPasswordEmail,
  sendVerificationEmail
} from '../mailtrap/emails.js'
import crypto from 'crypto'
export const signup = async (req, res) => {
  const { name, email, password } = req.body
  try {
    if (!email || !name || !password) {
      throw new Error('All fields need to be provided')
    }

    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationToken = Math.floor(Math.random() * 999999).toString()

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
    await user.save()

    // // jwt
    generateTokenAndSetCookie(res, user._id)

    // send verification email
    await sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        ...user._doc,
        password: null // remove password from response
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyEmail = async (req, res) => {
  const { token } = req.body
  try {
    if (!token) {
      throw new Error('Token is required')
    }
    const user = await User.findOne({
      verificationToken: token,
      verificationExpiresAt: {
        $gt: Date.now()
      }
    })

    if (!user) {
      throw new Error('Invalid or expired token')
    }

    user.isVerified = true
    user.verificationToken = null
    user.verificationExpiresAt = null
    await user.save()

    await sendEmailWelcome(user.email, user.name)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials (Email)'
      })
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials (Password)'
      })
    }

    generateTokenAndSetCookie(res, user._id)
    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: null // remove password from response
      }
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    if (!email) {
      throw new Error('Email is required')
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000 // 1 hours
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiresAt = resetTokenExpiresAt

    await user.save()

    // Send email
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendResetPasswordEmail(user.email, resetURL)
    return res.status(200).json({
      success: true,
      message: 'Reset password email sent successfully'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body
  const { token } = req.params
  try {
    if (!token || !newPassword) {
      throw new Error('Reset token and new password are required')
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: {
        $gt: Date.now()
      }
    })
    if (!user) {
      throw new Error('[TokenError]: Invalid or expired reset token')
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetPasswordToken = null
    user.resetPasswordExpiresAt = null
    await user.save()

    // Send mail success
    await sendResetEmailSuccess(user.email)
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }
    return res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: null // remove password from response
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

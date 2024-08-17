import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d'
  })
  res.cookie('token', token, {
    httpOnly: true, // don't allow client access to cookies
    sameSite: 'strict', // CSRF protection enabled by default for all sites
    secure: process.env.NODE_ENV === 'production', // Only work in https,
    maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days
  })

  return token
}

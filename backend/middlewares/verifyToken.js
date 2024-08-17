import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

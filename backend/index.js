import express from 'express'
import cors from 'cors'
import { connectDB } from './db/connectDB.js'
import { configDotenv } from 'dotenv'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'
configDotenv()

const app = express()
const PORT = process.env.PORT || 8888
const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use('/api/v1/auth', authRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  connectDB()
  console.log(`Server listening at http://localhost:${PORT}`)
})

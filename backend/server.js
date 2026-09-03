const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const searchRoutes = require('./routes/searchRoutes')

const app = express()
const PORT = process.env.PORT || 5000

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    cb(null, ext && mime)
  }
})

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(
  cors({
    origin: function (origin, callback) {
      const isVercelOrigin = origin && /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/.test(origin)
      if (!origin || allowedOrigins.includes(origin) || isVercelOrigin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/search', searchRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

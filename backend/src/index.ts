
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import 'dotenv/config'

import dataRoutes from './routes/data'
import preferenceRoutes from './routes/preferences'
import authRoutes from './routes/auth'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "../../front-end/dist")))

app.use("/api/data", dataRoutes)
app.use("/api/preferences", preferenceRoutes)
app.use("/api/auth", authRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../front-end/dist', 'index.html'))
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

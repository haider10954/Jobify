//EXPRESS
import express from "express";
const app = express()

//.ENV
import dotenv from 'dotenv'
dotenv.config()

//MORGAN
import "express-async-errors"
import morgan from 'morgan'

// DB AND AUTHENTICATOR
import connectDB from './db/connect.js'

//ROUTER
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

// MIDDLEWARE
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import authenticateUser from './middleware/auth.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// SECURITY PACKAGES
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'


// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))

if(process.env.NODE_ENV !== 'production')
{
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())


app.get('/', (req, res) => {
  res.json({msg:'Welcome!'})
})

app.get('/api/v1', (req, res) => {
  res.json({msg:'API'})
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser,jobsRouter)

// only when ready to deploy
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000


const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL)
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`)
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  start()
  
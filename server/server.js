require('dotenv').config()

const express = require('express')
const cors = require('cors')

const documentRoutes = require('./routes/document.route')
const userRoutes = require('./routes/user.route')

const socketHandlers = require('./utils/socketHandlers')
const dbConnection = require('./utils/database')

const app = express()

dbConnection()
socketHandlers()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  }),
)

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/documents', documentRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

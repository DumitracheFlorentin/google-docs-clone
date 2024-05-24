require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('node:path')

const Document = require('./models/Document')
const User = require('./models/User')

const documentRoutes = require('./routes/document.route')
const userRoutes = require('./routes/user.route')

const app = express()
const PORT = process.env.PORT

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err))

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  }),
)

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/documents', documentRoutes)

// deployment
const __dirname1 = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully!')
  })
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
})

const defaultValue = ''

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId, userId) => {
    const document = await findOrCreateDocument(documentId, userId)
    socket.join(documentId)
    socket.emit('load-document', document)
    socket.emit('load-history', document.history)

    socket.on('send-changes', async (delta) => {
      const user = await User.findById(userId)

      if (!user) {
        console.error('User not found')
        return
      }

      const userEmail = user.email

      socket.broadcast.to(documentId).emit('receive-changes', delta)
      const historyEntry = {
        userEmail,
        timestamp: new Date(),
        change: JSON.stringify(delta),
        action: 'edit',
      }

      Document.findByIdAndUpdate(
        documentId,
        {
          $push: { history: historyEntry },
        },
        { new: true },
      ).then((updatedDocument) => {
        io.in(documentId).emit('history-update', historyEntry)
      })
    })

    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data })
    })

    socket.on('update-title', async ({ documentId, title }) => {
      await Document.findByIdAndUpdate(documentId, { title })
      socket.to(documentId).emit('title-updated', title)
    })
  })
})

async function findOrCreateDocument(id, userId) {
  if (!id) return null

  let document = await Document.findById(id)
  if (document) {
    if (
      document.owner.toString() !== userId &&
      !document.participants.includes(userId)
    ) {
      document.participants.push(userId)
      await document.save()
    }
    return document
  } else {
    return await Document.create({
      _id: id,
      data: defaultValue,
      owner: userId,
      participants: [userId],
      history: [],
    })
  }
}

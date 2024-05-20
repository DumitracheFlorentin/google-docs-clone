const User = require('../models/User')
const Document = require('../models/Document')

module.exports = () => {
  const io = require('socket.io')(process.env.SOCKET_PORT, {
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
}

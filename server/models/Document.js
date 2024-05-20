const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: false, default: '' },
  data: { type: Object, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

const Document = mongoose.model('Document', documentSchema)
module.exports = Document

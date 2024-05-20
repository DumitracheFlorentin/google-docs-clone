const Document = require('../models/Document')

exports.getDocumentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const documents = await Document.find({ participants: userId })
    res.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ message: 'Error fetching documents' })
  }
}

const express = require('express')
const { getDocumentsByUser } = require('../controllers/document.controller')
const router = express.Router()

router.get('/:userId', getDocumentsByUser)

module.exports = router

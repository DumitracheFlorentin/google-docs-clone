const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = new User({ email, password })
    await user.save()
    res.status(201).json({
      id: user._id,
      email: user.email,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials')
    }

    res.json({
      id: user._id,
      email: user.email,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

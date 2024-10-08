const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) return res.status(401).json({ error: 'invalid username or password' })
  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (!password || password.length < 3) return res.status(400).json({ error: 'password missing or too short' })
  const passwordHash = await bcrypt.hash(password, 10)
  const savedUser = await new User({ username, name, passwordHash }).save()
  res.status(201).json(savedUser)
})

router.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  res.json(users)
})

module.exports = router
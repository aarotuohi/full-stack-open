const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method}, Path: ${req.path}, Body:`, req.body)
  next()
}

const unknownEndpoint = (req, res) => res.status(404).send({ error: 'unknown endpoint' })

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  const errorTypes = {
    CastError: 400,
    ValidationError: 400,
    MongoServerError: error.message.includes('E11000') ? 400 : undefined
  }
  if (errorTypes[error.name]) return res.status(errorTypes[error.name]).send({ error: error.message })
  next(error)
}

const getTokenFrom = (req) => req.get('authorization')?.replace('Bearer ', '') || null

const userExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)
  if (!token) return res.status(401).json({ error: 'token missing' })
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: 'token invalid' })
  req.user = await User.findById(decodedToken.id)
  if (!req.user) return res.status(401).json({ error: 'user not found' })
  next()
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, userExtractor }

const mongoose = require('mongoose')
const MONGODB_URI = require('../utils/config').MONGODB_URI


mongoose.set('strictQuery', false)
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const schema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  comments: [String],
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

schema.set('toJSON', {
  transform: (_, obj) => { obj.id = obj._id.toString(); delete obj._id; delete obj.__v }
})

module.exports = mongoose.model('Blog', schema)


const mongoose = require('mongoose')

const schema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

schema.set('toJSON', {
  transform: (_, obj) => { obj.id = obj._id.toString(); delete obj._id; delete obj.__v }
})

module.exports = mongoose.model('Blog', schema)


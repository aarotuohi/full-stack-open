const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, minlength: 3, required: true, unique: true },
  name: String,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
})

userSchema.set('toJSON', {
  transform: (_, obj) => { obj.id = obj._id.toString(); delete obj._id; delete obj.__v; delete obj.passwordHash }
})

module.exports = mongoose.model('User', userSchema)

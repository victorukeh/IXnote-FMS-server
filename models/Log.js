const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  Ip: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Log', LogSchema)

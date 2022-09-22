const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  size: Number,
  type: {
    type: String,
    required: true,
  },
},
{
  timestamps: { createdAt: true, updatedAt: true },
})

module.exports = mongoose.model('File', FileSchema)

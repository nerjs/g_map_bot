const { Schema, model } = require('mongoose')

const schema = new Schema({
  text: {
    type: String,
  },
  version: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24 * 30 * 3,
    default: Date.now,
  },
})

module.exports = model('Changelogs', schema)

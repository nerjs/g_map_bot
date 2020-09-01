const { Schema, model } = require('mongoose')
const { TTL } = require('../../constants')

const schema = new Schema({
  message: {
    type: String,
  },
  version: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    expires: TTL.CHANGELOG,
    default: Date.now,
  },
})

module.exports = model('Changelogs', schema)

const { Schema } = require('mongoose')
const imgSchema = require('./img')

module.exports = new Schema({
  originalId: {
    type: String,
    required: true,
    index: true,
  },
  large: {
    type: imgSchema,
    required: true,
  },
  thumb: {
    type: imgSchema,
    required: true,
  },
})

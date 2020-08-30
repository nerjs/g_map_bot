const { Schema } = require('mongoose')
const imgSchema = require('./img')
const { MAP_TYPES } = require('../../constants')

const schema = new Schema(
  {
    mapType: {
      type: String,
      enum: Object.values(MAP_TYPES),
      required: true,
    },
    zoom: {
      type: Number,
      min: 0,
      max: 21,
      required: true,
    },
    large: {
      type: imgSchema,
      required: true,
    },
    thumb: {
      type: imgSchema,
      required: true,
    },
  },
  { _id: false },
)

schema.index({ mapType: 1, zoom: 1 })

module.exports = schema

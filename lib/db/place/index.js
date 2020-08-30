const { Schema, model } = require('mongoose')
const { TTL } = require('../../constants')
const photoSchema = require('../helpers/photo')
const pointSchema = require('../helpers/point')
const viewportSchema = require('../helpers/viewport')
const mapSchema = require('../helpers/map')

const schema = new Schema({
  placeId: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    minlength: 2,
    maxlength: 4,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  viewport: {
    type: viewportSchema,
  },
  title: String,
  description: String,
  url: String,
  maps: [mapSchema],
  photos: [photoSchema],
  createdAt: {
    type: Date,
    expires: TTL.PLACE,
    default: Date.now,
  },
})

schema.index({ placeId: 'text', lang: 'text' })

module.exports = model('Place', schema)

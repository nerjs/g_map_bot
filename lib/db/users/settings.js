const { Schema } = require('mongoose')
const { MAP_TYPES, DEFAULT_DESCRIPTION_FORMAT } = require('../../constants')

module.exports = new Schema(
  {
    mapType: {
      type: String,
      enum: Object.keys(MAP_TYPES).map(key => MAP_TYPES[key]),
      default: MAP_TYPES.ROADMAP,
    },
    hasDescriptions: {
      type: Boolean,
      default: true,
    },
    formatDescriptions: {
      type: String,
      default: DEFAULT_DESCRIPTION_FORMAT,
    },
    inlineHasMap: {
      type: Boolean,
      default: false,
    },
    botUpdates: {
      type: Boolean,
      default: false,
    },
  },
  { id: false, _id: false },
)

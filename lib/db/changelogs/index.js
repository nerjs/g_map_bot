const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    text: {
      type: String,
    },
    version: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = model('Changelogs', schema)

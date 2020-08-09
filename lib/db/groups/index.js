const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
    },
    username: String,
  },
  {
    timestamps: true,
  },
)

module.exports = model('Group', schema)

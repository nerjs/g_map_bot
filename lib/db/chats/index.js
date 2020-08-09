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
    chatType: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = model('Group', schema)

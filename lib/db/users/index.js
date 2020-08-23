const { Schema, model } = require('mongoose')
const settingsSchema = require('./settings')

const schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    chatId: {
      type: Number,
    },
    displayName: String,
    username: String,
    lang: {
      type: String,
      minlength: 2,
      maxlength: 4,
    },
    settings: {
      type: settingsSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

module.exports = model('User', schema)

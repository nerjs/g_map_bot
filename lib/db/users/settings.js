const { Schema } = require('mongoose')

module.exports = new Schema(
  {
    boolField: {
      type: Boolean,
      default: false,
    },
    enumField: {
      type: String,
      enum: ['f1', 'f2', 'f3', 'lllllllllllloooooooooo'],
      default: 'f2',
    },
    stringField: {
      type: String,
      default: 'jjh',
      minlength: 3,
      maxlength: 5,
    },
    numberField: {
      type: Number,
      default: 13,
      min: 12,
    },
  },
  { id: false, _id: false },
)

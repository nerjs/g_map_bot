const { Schema } = require('mongoose')

module.exports = new Schema(
  {
    link: {
      type: String,
      minlength: 5,
      match: /^https?:\/\//,
      required: function() {
        return !this.tgId
      },
    },
    tgId: {
      type: String,
      required: function() {
        return !this.link
      },
    },
    width: {
      type: Number,
      required: true,
      min: 1,
    },
    height: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
)

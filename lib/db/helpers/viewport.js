const { Schema } = require('mongoose')
const pointSchema = require('./point')

module.exports = new Schema(
  {
    ne: {
      type: pointSchema,
      required: true,
      alias: 'northeast',
    },
    sw: {
      type: pointSchema,
      required: true,
      alias: 'southwest',
    },
  },
  { _id: false },
)

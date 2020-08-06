const {
  Types: { ObjectId },
} = require('mongoose')

exports.getId = () => `${new ObjectId()}`

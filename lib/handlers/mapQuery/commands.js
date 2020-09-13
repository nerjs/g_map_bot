const { searchHandler, coordinatesHandler, urlHandler } = require('./commandHandlers')
const {
  inputSearchText,
  inputCoordinatesText,
  inputUrlText,
  incorrectCoordinates,
  incorrectSearch,
  incorrectUrl,
} = require('./messages')
const { createHandler, createReplyHandler } = require('./helpers/createHanlers')

exports.replyHandler = createReplyHandler()

exports.search = createHandler('search', searchHandler, inputSearchText, incorrectSearch)

exports.coordinates = createHandler('coordinates', coordinatesHandler, inputCoordinatesText, incorrectCoordinates)

exports.url = createHandler('url', urlHandler, inputUrlText, incorrectUrl)

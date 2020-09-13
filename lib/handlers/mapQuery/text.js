const createCoordsRegexp = require('../../utils/createCoordsRegexp')
const { searchHandler, coordinatesHandler, urlHandler } = require('./commandHandlers')

const coordsFormat = createCoordsRegexp(createCoordsRegexp.sepTypes.COLON, createCoordsRegexp.sepTypes.COMMA)

module.exports = async ctx => {
  const { text } = ctx.message || { text: '' }

  if (coordsFormat.test(text)) return coordinatesHandler(ctx, text)

  return searchHandler(ctx, text)
}

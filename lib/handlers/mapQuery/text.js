const searchText = require('./helpers/searchText')
const createCoordsRegexp = require('../../utils/createCoordsRegexp')
const coordinatesText = require('./helpers/coordinatesText')

const coordsFormat = createCoordsRegexp(createCoordsRegexp.sepTypes.COLON, createCoordsRegexp.sepTypes.COMMA)

module.exports = async ctx => {
  const { text } = ctx.message || { text: '' }

  if (coordsFormat.test(text)) return coordinatesText(ctx, text)

  return searchText(ctx, text)
}

const createCoordsRegexp = require('../../../utils/createCoordsRegexp')
const Place = require('../../../map/Place')
const { incorrectCoordinates } = require('../messages')
const mapOptions = require('./mapOptions')
const { prepareText, preparePhoto } = require('./prepareMessage')
const getMapType = require('../../../utils/getMapType')

const format = createCoordsRegexp(createCoordsRegexp.sepTypes.ALL)

module.exports = async (ctx, inputTxt) => {
  const coords = format.match(`${inputTxt}`.trim())

  if (!coords) return ctx.reply(incorrectCoordinates)

  let place = await Place.coordinatesOne(coords.lat, coords.lng, mapOptions(ctx))

  if (!place) {
    place = await Place.createDetail(mapOptions(ctx, coords))
  }

  const text = prepareText(place)

  const { photo, large } = preparePhoto(
    coords.type === 'photo' ? place.photos[0] : place.getMap(getMapType(coords.type), coords.zoom),
    place.getMap(getMapType(coords.notExists), coords.zoom),
  )

  if (photo) {
    const resultMessage = await ctx.replyWithPhoto(large.link, { caption: text, parse_mode: 'MarkdownV2' })
    await place.setTg(photo, resultMessage.photo)
  } else {
    return cfx.replyWithMarkdown(text)
  }
}

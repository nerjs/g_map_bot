const createCoordsRegexp = require('../../../utils/createCoordsRegexp')
const Place = require('../../../map/Place')
const mapOptions = require('../helpers/mapOptions')
const getMapType = require('../../../utils/getMapType')
const sendPlace = require('../helpers/sendPlace')

const format = createCoordsRegexp(createCoordsRegexp.sepTypes.ALL)

module.exports = async (ctx, inputTxt, removeKeyboard) => {
  const coords = format.match(`${inputTxt}`.trim())

  if (!coords) return false

  let place = await Place.coordinatesOne(coords.lat, coords.lng, mapOptions(ctx))

  if (!place) {
    place = await Place.createDetail(mapOptions(ctx, coords))
  }

  await sendPlace(
    ctx,
    place,
    coords.type === 'photo' ? place.photos[0] : place.getMap(getMapType(coords.type), coords.zoom),
    place.getMap(getMapType(coords.notExists), coords.zoom),
    removeKeyboard,
  )

  return true
}

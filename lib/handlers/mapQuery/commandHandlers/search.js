const Place = require('../../../map/Place')
const mapOptions = require('../helpers/mapOptions')
const { SEARCH_TEXT } = require('../../../constants')
const sendPlace = require('../helpers/sendPlace')

module.exports = async (ctx, inputTxt, removeKeyboard) => {
  if (!inputTxt || inputTxt.length < SEARCH_TEXT.MIN || inputTxt.length > SEARCH_TEXT.MAX) return false

  const place = await Place.searchOne(inputTxt, mapOptions(ctx))

  if (!place) return !!(await ctx.reply('Empty result'))

  await sendPlace(ctx, place, place.photos[0], place.getMap(), removeKeyboard)

  return true
}

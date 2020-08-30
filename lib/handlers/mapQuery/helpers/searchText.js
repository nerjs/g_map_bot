const { commandSubtype } = require('../../../utils/str')
const Place = require('../../../map/Place')
const mapOptions = require('./mapOptions')
const { incorrectSearch } = require('../messages')
const { SEARCH_TEXT } = require('../../../constants')
const { prepareText, preparePhoto } = require('./prepareMessage')

module.exports = async (ctx, inputTxt) => {
  if (!inputTxt || inputTxt.length < SEARCH_TEXT.MIN || inputTxt.length > SEARCH_TEXT.MAX) return ctx.reply(incorrectSearch)

  const place = await Place.searchOne(inputTxt, mapOptions(ctx))

  if (!place) return ctx.reply('Empty result')

  const text = prepareText(place)
  const { photo, large } = preparePhoto(place.photos[0], place.getMap())
  console.log(text)
  if (photo) {
    const resultMessage = await ctx.replyWithPhoto(large.link, { caption: text, parse_mode: 'MarkdownV2' })
    await place.setTg(photo, resultMessage.photo)
  } else {
    return cfx.replyWithMarkdown(text)
  }
}

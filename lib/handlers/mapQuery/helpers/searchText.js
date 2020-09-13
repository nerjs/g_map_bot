const { Extra, Markup } = require('telegraf')
const Place = require('../../../map/Place')
const mapOptions = require('./mapOptions')
const { incorrectSearch } = require('../messages')
const { SEARCH_TEXT } = require('../../../constants')
const { prepareText, preparePhoto } = require('./prepareMessage')

module.exports = async (ctx, inputTxt, removeKeyboard) => {
  if (!inputTxt || inputTxt.length < SEARCH_TEXT.MIN || inputTxt.length > SEARCH_TEXT.MAX) return ctx.reply(incorrectSearch)

  const place = await Place.searchOne(inputTxt, mapOptions(ctx))

  if (!place) return ctx.reply('Empty result')

  const text = prepareText(place)
  const { photo, large } = preparePhoto(place.photos[0], place.getMap())

  if (photo) {
    const resultMessage = await ctx.replyWithPhoto(
      large.link,
      Extra.caption(text)
        .load({ parse_mode: 'MarkdownV2' })
        .markup(Markup.removeKeyboard(!!removeKeyboard)),
    )

    await place.setTg(photo, resultMessage.photo)
  } else {
    return cfx.replyWithMarkdown(text)
  }
}

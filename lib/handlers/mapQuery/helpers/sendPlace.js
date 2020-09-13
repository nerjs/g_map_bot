const { Extra, Markup } = require('telegraf')
const { preparePhoto, prepareText } = require('./prepareMessage')

module.exports = async (ctx, place, corePhoto, reservePhoto, removeKeyboard) => {
  const text = prepareText(place)
  const { photo, large } = preparePhoto(corePhoto, reservePhoto)

  if (photo) {
    const resultMessage = await ctx.replyWithPhoto(
      large.link,
      Extra.caption(text)
        .load({ parse_mode: 'MarkdownV2' })
        .markup(Markup.removeKeyboard(!!removeKeyboard)),
    )

    await place.setTg(photo, resultMessage.photo)
  } else {
    await cfx.replyWithMarkdown(text)
  }
}

const { Markup } = require('telegraf')
const { prepareMarkdownMsg } = require('../../../utils/str')

module.exports = async ctx => {
  const result = ctx.result
  const variants = await result.variants()

  if (!variants.length) return ctx.answerInlineQuery([], {})
  await result.saveCache()

  const results = variants.map(({ id, title, lat, lng, url, large, thumb }) => ({
    id,
    type: 'photo',
    // type: 'article',
    // message_text: 'message text',
    title,
    description: `${lat} : ${lng}`,
    caption: `*${prepareMarkdownMsg(title)}*\n_${prepareMarkdownMsg(`${lat} : ${lng}`)}_`,
    parse_mode: 'Markdown',
    photo_url: large.link,
    photo_width: large.width,
    photo_height: large.height,
    thumb_url: thumb.link,
    thumb_width: thumb.width,
    thumb_height: thumb.height,
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.urlButton('↩️', `t.me/${ctx.botInfo.username}?start=${id}`),
        Markup.callbackButton('👍 0', 'like'),
        Markup.callbackButton('0 👎', 'dislike'),
      ],
      [Markup.urlButton('show', url)],
    ]),
  }))

  await ctx.answerInlineQuery(results, {
    cache_time: 20,
    switch_pm_text: 'Edit',
    switch_pm_parameter: result.savedId,
  })
}

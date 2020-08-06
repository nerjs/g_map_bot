const { Composer, Markup } = require('telegraf')

const send = new Composer()

const prepareMsg = msg =>
  `${msg}`
    .trim()
    .replace(/\./g, '.')
    .replace(/:/g, ':')

send.on('inline_query', async ctx => {
  const result = ctx.result
  const variants = await result.variants()

  if (!variants.length) return ctx.answerInlineQuery([], {})
  await result.saveCache()

  console.log(variants)
  console.log(result)

  const results = variants.map(({ id, title, lat, lng, url, large, thumb }) => ({
    id,
    type: 'photo',
    // type: 'article',
    // message_text: 'message text',
    title,
    description: `${lat} : ${lng}`,
    caption: `*${prepareMsg(title)}*\n_${prepareMsg(`${lat} : ${lng}`)}_`,
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

  const res = await ctx.answerInlineQuery(results, {
    cache_time: 20,
    switch_pm_text: 'Edit',
    switch_pm_parameter: result.savedId,
  })

  console.log(res)
})

module.exports = send

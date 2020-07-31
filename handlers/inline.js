const { Markup } = require('telegraf')
const logger = require('nlogs')(module)
const { inlineCache } = require('../utils/cache')
const QueryParser = require('../utils/QueryParser')
const QueryResult = require('../utils/QueryResult')
const ResultMessage = require('../utils/ResultMessage')
const { CACHE_TIME } = require('../constants')

const emptyResult = async ctx => {
  await ctx.answerInlineQuery([], { cache_time: CACHE_TIME.INLINE_EMPTY })
  logger.debug('Empty result')
}

module.exports = async (str, ctx) => {
  logger.debug('Inline query start parse', { str, from: ctx.from })
  const query = await QueryParser.parse(str)
  if (!query.hasResult) return emptyResult(ctx)

  const isConsist = await inlineCache.setConsist(ctx, { query })

  const result = await QueryResult.result(query)

  if (!(await isConsist())) return
  if (!result.hasResult) return emptyResult(ctx)

  const message = new ResultMessage(result, ctx)

  await message.send()

  logger.debug('Inline query result', { str, from: ctx.from, type: result.type })
}

module.exports2 = async (str, ctx) => {
  const qParsed = await QueryParser.parse(str)
  const { query, id, url } = qParsed

  if (!qParsed.hasResult) return ctx.answerInlineQuery([], { cache_time: 1000 })

  ctx.session.inlineCacheId = await inlineCache.set(ctx.session.inlineCacheId, { query, id, url })

  const results = []

  if (query)
    results.push({
      id: `cache_${ctx.session.inlineCacheId}`,
      type: 'article',
      title: 'query',
      description: query,
      input_message_content: {
        message_text: query,
      },
    })

  if (id)
    results.push({
      id: `id:${id}`,
      type: 'article',
      title: 'ID',
      description: id,
      input_message_content: {
        message_text: `is ID: ${id}`,
      },
    })

  if (url)
    results.push({
      id: `cache_${ctx.session.inlineCacheId}`,
      type: 'article',
      title: 'url',
      description: url.url,
      input_message_content: {
        message_text: `***Url***\nhh`,
        parse_mode: 'Markdown',
      },
      reply_markup: Markup.inlineKeyboard([Markup.callbackButton('qwerty', 'tratata')]),
    })

  await ctx.answerInlineQuery(results, {
    cache_time: 10,
    switch_pm_text: 'edit',
    switch_pm_parameter: `cache_${ctx.session.inlineCacheId}`,
  })
}

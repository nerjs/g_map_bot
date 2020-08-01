const logger = require('nlogs')(module)
const { CACHE_TIME } = require('../constants')
const parseQuery = require('./parseQuery')

const emptyResult = async ctx => {
  await ctx.answerInlineQuery([], { cache_time: CACHE_TIME.INLINE_EMPTY })
  logger.debug('Empty result')
}

module.exports = async (str, ctx) => {
  logger.debug('Inline query start parse', { str, from: ctx.from })

  await parseQuery(str, ctx, {
    emptyQuery: emptyResult,
    emptyResult,
  })

  logger.debug('Inline query result', { str, from: ctx.from })
}

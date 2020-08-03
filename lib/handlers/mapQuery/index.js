const { Composer } = require('telegraf')
const parseQuery = require('./parseQuery')
const result = require('./result')
const send = require('./send')
const { debounceCache } = require('../../utils/cache')
const empty = require('./empty')

const mapQuery = new Composer()

mapQuery.use(parseQuery)

mapQuery.use(
  Composer.optional(
    ctx => !!ctx.query,
    Composer.tap(async ctx => {
      ctx.isConsist = await debounceCache.setConsist(ctx)
    }),
    Composer.tap(result),
  ),
)

mapQuery.use(
  Composer.optional(
    ctx => !!ctx.result,
    Composer.filter(async ctx => {
      return ctx.isConsist && (await ctx.isConsist())
    }),
    send,
  ),
)

mapQuery.use(Composer.optional(ctx => !!ctx.query, empty))

module.exports = mapQuery

const { Composer } = require('telegraf')
const parseQuery = require('./parseQuery')
const result = require('./result')
const send = require('./send')
const { debounceCache } = require('../../utils/cache')
const empty = require('./empty')
const { tap, optionalQuery, asyncTap, filter, optionalResult } = require('../helpers')

const mapQuery = new Composer()

mapQuery.use(parseQuery)

mapQuery.use(
  optionalQuery(
    tap(async ctx => {
      ctx.isConsist = await debounceCache.setConsist(ctx)
    }),
    asyncTap(result),
  ),
)

mapQuery.use(
  optionalResult(
    filter(async ctx => {
      if (!ctx.result || !ctx.isConsist) return false
      return ctx.isConsist()
    }, send),
  ),
)

mapQuery.use(optionalQuery(empty))

module.exports = mapQuery

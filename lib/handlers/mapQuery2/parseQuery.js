const { Composer } = require('telegraf')
const { QS_REGEXP } = require('./constants')
const UrlParser = require('../../utils/UrlParser')
const prepareQuery = require('./prepareQuery')

const parseQuery = new Composer()

parseQuery.command(
  'start',
  Composer.tap(ctx => (ctx.queryString = ctx.startPayload)),
)
parseQuery.on(
  'text',
  Composer.tap(ctx => (ctx.queryString = ctx.message.text)),
)
parseQuery.on(
  'inline_query',
  Composer.tap(ctx => (ctx.queryString = ctx.inlineQuery.query)),
)

parseQuery.use(
  Composer.optional(
    ctx => !!ctx.queryString,
    Composer.tap(ctx => {
      const matched = ctx.queryString.match(QS_REGEXP)

      ctx.query = (() => {
        if (matched && matched.groups) return { ...matched.groups }
        const url = new UrlParser(ctx.queryString)
        if (url.success) return { type: 'url', url }
        if (ctx.queryString.length >= 3) return { type: 'search', search: ctx.queryString }
        return {}
      })()

      delete ctx.queryString
    }),
  ),
)

parseQuery.use(Composer.optional(ctx => !!ctx.query, prepareQuery))

module.exports = parseQuery

const { Composer, Context } = require('telegraf')
const logger = require('nlogs')(module)
const SearchResult = require('./cl/SearchResult')
const IdResult = require('./cl/IdResult')
const FormatResult = require('./cl/FormatResult')
const CachedResult = require('./cl/CachedResult')
const UrlResult = require('./cl/UrlResult')
const { optional, tap, optionalResult, typing } = require('../../../utils/helpers')

const result = new Composer()

const typesOptional = (type, Cl) =>
  optional(
    ctx => ctx.query.type === type,
    tap(ctx => {
      ctx.result = new Cl(ctx.query, ctx)
    }),
  )

result.use(typesOptional('search', SearchResult))
result.use(typesOptional('format', FormatResult))
result.use(typesOptional('id', IdResult))
result.use(typesOptional('cache', CachedResult))
result.use(typesOptional('url', UrlResult))

result.use(
  optional(
    ctx => !ctx.result,
    tap(ctx => {
      logger.warn('Unknown query type', { query: ctx.query })
    }),
  ),
)

result.command('start', optionalResult(tap(typing())))
result.on('text', optionalResult(tap(typing())))
result.use(optionalResult(tap(ctx => ctx.result.load())))

result.use(
  optionalResult(
    tap(ctx => {
      if (!ctx.result.ready) {
        delete ctx.result
      }
    }),
  ),
)

module.exports = result

const { Composer } = require('telegraf')

const prepareQuery = new Composer()

prepareQuery.command(
  'start',
  Composer.tap(async ctx => {
    if (!['id', 'cache', 'format'].includes(ctx.query.type)) {
      delete ctx.query
    } else if (ctx.query.type === 'cache') {
      const savedQuery = await inlineCache.get(ctx.query.id)

      if (savedQuery) {
        ctx.query = { ...savedQuery }
      } else {
        delete ctx.query
      }
    }
  }),
)

prepareQuery.on(
  ['text', 'inline_query'],
  Composer.tap(ctx => {
    if (!ctx.query || ctx.query.type === 'cache') {
      delete ctx.query
    }
  }),
)

prepareQuery.use(
  Composer.optional(
    ctx => !!ctx.query,
    Composer.tap(ctx => {
      const { type, subType, id, lat, lng, zoom, url, search } = ctx.query

      if (
        !Object.keys(ctx.query).length ||
        (type === 'id' && !id) ||
        (type === 'format' && (!lat || !lng || !zoom)) ||
        (type === 'url' && !url) ||
        (type === 'search' && !search)
      ) {
        delete ctx.query
      }

      if (type === 'id' && !subType) ctx.query.subType = 'draft'
    }),
  ),
)

module.exports = prepareQuery

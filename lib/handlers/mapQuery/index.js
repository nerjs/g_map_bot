const { Composer } = require('telegraf')
const MapQuery = require('./helpers/MapQuery')
const parse = require('./parse')
const request = require('./request')
const send = require('./send')
const { tap } = require('../../utils/helpers')
const logger = require('nlogs')(module)

const mq = new Composer()

mq.use(MapQuery.setMapQuery())

mq.use(tap(parse))

// mq.use(tap(ctx => logger.debug(ctx.mapQuery, ctx.mapQuery.correctRequest)))

mq.use(MapQuery.optionalRequest(tap(request)))

mq.use(MapQuery.optionalResponse(send))

mq.use(MapQuery.optionalError(ctx => ctx.reply(ctx.mapQuery.error)))

module.exports = mq

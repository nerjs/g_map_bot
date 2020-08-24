const { Composer } = require('telegraf')
const MapQuery = require('./helpers/MapQuery')
const parse = require('./parse')
const request = require('./request')
const send = require('./send')
const { tap } = require('../../utils/helpers')

const mq = new Composer()

mq.use(MapQuery.setMapQuery())

mq.use(parse)

mq.use(MapQuery.optionalRequest(tap(request)))

mq.use(MapQuery.optionalResponse(send))

module.exports = mq

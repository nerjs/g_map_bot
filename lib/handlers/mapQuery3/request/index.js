const { Composer } = require('telegraf')
const logger = require('nlogs')(module)
const Request = require('../helpers/MapQuery/Request')
const search = require('./search')

const request = new Composer()

request.use(ctx => logger.debug(ctx.mapQuery))

request.use(Request.optional(Request.TYPES.SEARCH, search))

module.exports = request

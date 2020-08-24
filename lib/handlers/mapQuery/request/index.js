const { Composer } = require('telegraf')
const logger = require('nlogs')(module)

const request = new Composer()

request.use(ctx => logger.debug(ctx.mapQuery))

module.exports = request

const logger = require('nlogs')(module)

module.exports = ctx => logger.log('channels', ctx.chat)

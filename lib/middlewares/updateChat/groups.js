const logger = require('nlogs')(module)

module.exports = ctx => logger.log('groups', ctx.chat)

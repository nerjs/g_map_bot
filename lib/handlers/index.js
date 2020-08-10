const { Composer } = require('telegraf')
const start = require('./start')
const help = require('./help')

const handlers = new Composer()

handlers.use(help)

handlers.start(Composer.privateChat(start))

module.exports = handlers

const { Composer } = require('telegraf')
const start = require('./start')
const help = require('./help')
const settings = require('./settings')

const handlers = new Composer()

handlers.use(help)
handlers.use(Composer.privateChat(settings))

handlers.start(Composer.privateChat(start))

module.exports = handlers

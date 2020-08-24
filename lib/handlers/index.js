const { Composer } = require('telegraf')
const start = require('./start')
const help = require('./help')
const settings = require('./settings')
const info = require('./info')
const mapQuery = require('./mapQuery')

const handlers = new Composer()

handlers.use(help)
handlers.use(Composer.privateChat(settings))
handlers.command('info', info)

handlers.use(mapQuery)

handlers.start(Composer.privateChat(start))

module.exports = handlers

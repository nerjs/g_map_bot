require('dotenv').config()
const logger = require('nlogs')(module)
const bot = require('./utils/bot')
const inline = require('./handlers/inline')
const start = require('./handlers/start')

bot.start(start)
bot.inlineQuery(inline)

require('dotenv').config()
const logger = require('nlogs')(module)
const bot = require('./utils/bot')
const inline = require('./handlers/inline')
const start = require('./handlers/start')
const markdown = require('./middlewares/markdown')
const matchedGroups = require('./middlewares/matchedGroups')

bot.use(markdown)
bot.use(matchedGroups)

bot.start(start)
bot.inlineQuery(inline)

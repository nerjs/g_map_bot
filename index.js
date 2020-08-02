require('dotenv').config()
const bot = require('./utils/bot')
const inline = require('./handlers/inline')
const start = require('./handlers/start')
const markdown = require('./middlewares/markdown')
const matchedGroups = require('./middlewares/matchedGroups')
const text = require('./handlers/text')

bot.use(markdown)
bot.use(matchedGroups)

bot.start(start)
bot.inlineQuery(inline)
bot.on('text', text)

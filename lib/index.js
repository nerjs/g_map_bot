require('dotenv').config()
const bot = require('./utils/bot')
const start = require('./handlers/start')
const mapQuery = require('./handlers/mapQuery')
const { startMdw, endMdw } = require('./middlewares')

bot.use(startMdw)

bot.use(mapQuery)
bot.start(start)

bot.use(endMdw)

if (!process.env.BOT_NOT_LAUNCH) bot.launch()

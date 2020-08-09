require('dotenv').config()
const logger = require('nlogs')(module)
const bot = require('./utils/bot')
const start = require('./handlers/start')
const mapQuery = require('./handlers/mapQuery')
const { startMdw, endMdw } = require('./middlewares')
const { autoConnect } = require('./db')
const execTasks = require('./tasks')

bot.use(startMdw)

bot.use(mapQuery)
bot.start(start)

bot.use(endMdw)

if (!process.env.BOT_NOT_LAUNCH) {
  autoConnect()
    .then(() => bot.launch())
    .then(() => logger.info('Bot started'))
    .then(() => execTasks('changelog'))
    .then(() => logger.info('Success tasks!'))
    .catch(e => {
      logger.error(e)
      process.exit(1)
    })
}

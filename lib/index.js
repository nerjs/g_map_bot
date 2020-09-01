require('dotenv').config()
const logger = require('nlogs')(module)
const bot = require('./utils/bot')
const handlers = require('./handlers')
const { startMdw, endMdw } = require('./middlewares')
const { autoConnect } = require('./db')
const execTasks = require('./tasks')

bot.use(startMdw)

bot.use(handlers)

bot.use(endMdw)

if (!process.env.BOT_NOT_LAUNCH) {
  ;(async () => {
    await autoConnect()

    await execTasks()
    logger.info('Success tasks!')

    bot.launch()
    logger.info('Bot started!')
  })().catch(e => {
    logger.error(e)
    process.exit(1)
  })
}

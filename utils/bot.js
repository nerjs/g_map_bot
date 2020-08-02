const { Telegraf } = require('telegraf')
const updateLogger = require('telegraf-update-logger')
const logger = require('nlogs')(module)
const session = require('./session')
const files = require('./files')

const { TELEGRAM_TOKEN, NODE_ENV } = process.env

const bot = new Telegraf(TELEGRAM_TOKEN)

// if (NODE_ENV !== 'production') bot.use(updateLogger({ colors: true }))
bot.use(session)

bot.catch(e => {
  logger.error(e)
})

module.exports = bot

files
  .then(() => bot.launch())
  .then(() => logger.info('Bot started!'))
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

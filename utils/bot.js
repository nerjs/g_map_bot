const { Telegraf } = require('telegraf')
const updateLogger = require('telegraf-update-logger')
const logger = require('nlogs')(module)
const session = require('./session')

const { TELEGRAM_TOKEN, NODE_ENV } = process.env

const bot = new Telegraf(TELEGRAM_TOKEN)

// if (NODE_ENV !== 'production') bot.use(updateLogger({ colors: true }))
bot.use(session)

bot.catch(e => {
  logger.error(e)
})

setTimeout(
  () =>
    bot
      .launch()
      .then(() => logger.info('Start bot'))
      .catch(e => {
        logger.error(e)
        process.exit()
      }),
  1000,
)

module.exports = bot

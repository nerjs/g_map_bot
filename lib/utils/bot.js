const { Telegraf } = require('telegraf')
const logger = require('nlogs')(module)

const { TELEGRAM_TOKEN } = process.env

const bot = new Telegraf(TELEGRAM_TOKEN, { channelMode: true, handlerTimeout: 300 })

bot.catch(e => {
  logger.error(e)
})

module.exports = bot

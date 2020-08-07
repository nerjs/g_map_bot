const { Telegraf } = require('telegraf')
const logger = require('nlogs')(module)

const { TELEGRAM_TOKEN, NODE_ENV } = process.env

const bot = new Telegraf(TELEGRAM_TOKEN)

bot.catch(e => {
  logger.error(e)
})

module.exports = bot

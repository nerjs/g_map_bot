require('dotenv').config()
const logger = require('nlogs')(module)
const bot = require('./utils/bot')

bot.use(ctx => ctx.reply('qwert'))

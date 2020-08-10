const { Composer } = require('telegraf')
const { commangPrivate, commandGroup, actionPrivate, actionGroup, commandOther, actionOther } = require('./helpHandlers')
const messages = require('./messages')

const help = new Composer()

help.help(Composer.privateChat(commangPrivate), Composer.groupChat(commandGroup))

help.action(
  new RegExp(`^help\:(?<code>${Object.keys(messages).join('|')})$`),
  Composer.privateChat(Composer.optional(ctx => ctx.match && ctx.match.groups && ctx.match.groups.code, actionPrivate)),
  Composer.groupChat(Composer.optional(ctx => ctx.match && ctx.match.groups && ctx.match.groups.code, actionGroup)),
)

help.action(/^help\:(.*)$/, actionOther)
help.help(commandOther)

module.exports = help

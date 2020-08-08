require('colors')
const logger = require('nlogs')(`${process.cwd()}/log`)

const shortText = (txt, length) => `${txt.substr(0, length)}${txt.length > length ? '...' : ''}`

module.exports = name => async (ctx, next) => {
  const logMsg = []

  if (name) logMsg.push(`${name}`.white.bgBlack)

  logMsg.push(`${ctx.updateType}`.brightBlue)

  if (ctx.updateSubTypes && ctx.updateSubTypes.length) logMsg.push(`(${ctx.updateSubTypes.join(',')})`.blue)

  if (ctx.from)
    logMsg.push(
      `${[ctx.from.first_name, ctx.from.last_name, ctx.from.username ? `(@${ctx.from.username})` : null]
        .filter(n => !!n)
        .join(' ') || ctx.from.id}`.cyan.bold,
    )

  if (ctx.chat) logMsg.push(`${ctx.chat.title || ctx.chat.type}`.brightCyan.italic)

  const message = ctx.message || ctx.editedMessage || ctx.channelPost || ctx.editedChannelPost
  if (message) {
    if (message.author_signature) logMsg.push(`${message.author_signature}`.cyan.bold)

    if (message.reply_to_message) logMsg.push(`[${message.reply_to_message.message_id}]`.yellow.bold)

    const forwardFrom = message.forward_from || message.forward_from_chat
    if (forwardFrom)
      logMsg.push(
        `[${forwardFrom.title || forwardFrom.first_name || forwardFrom.type || forwardFrom.id}${
          message.forward_signature ? `:${message.forward_signature}` : ''
        }]`.yellow,
      )

    const { entities, caption_entities } = message
    const text = message.text || message.caption || ''
    const botCommand = (entities || caption_entities || []).find(entitie => entitie.type === 'bot_command')

    if (botCommand && !ctx.channelPost && !ctx.editedChannelPost) {
      const command = text.substr(botCommand.offset, botCommand.length)
      logMsg.push(`${command}`.magenta.bold)
      logMsg.push(`${botCommand.offset === 0 ? shortText(text.slice(botCommand.length), 10) : shortText(text, 10)}`.green)
    } else {
      logMsg.push(`${shortText(text, 10)}`.green)
    }
  }

  if (ctx.callbackQuery) logMsg.push(`${ctx.callbackQuery.data}`.yellow)

  if (ctx.inlineQuery) {
    logMsg.push(shortText(ctx.inlineQuery.query, 10).yellow)
    if (ctx.inlineQuery.offset) logMsg.push(`(${ctx.inlineQuery.offset})`.yellow.italic)
  }

  if (ctx.chosenInlineResult) {
    logMsg.push(`${ctx.chosenInlineResult.result_id}`.yellow)
    logMsg.push(`${shortText(ctx.chosenInlineResult.query, 10)}`.green)
  }

  const timer = logger.time(logMsg.filter(l => !!l).join(' '))

  try {
    await next(ctx)
  } finally {
    timer()
  }
}

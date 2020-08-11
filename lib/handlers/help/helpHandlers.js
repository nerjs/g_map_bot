const { Extra } = require('telegraf')
const getMessage = require('./getMessage')
const messages = require('./messages')

exports.commangPrivate = async ctx => {
  const matched = ctx.message.text.match(new RegExp(`^\/help(\\s(?<code>(${Object.keys(messages).join('|')})))?$`))
  const { msg, keyboard } = getMessage(matched && matched.groups && matched.groups.code)

  return ctx.replyWithMarkdown(msg, Extra.markup(keyboard))
}

exports.commandGroup = async ctx => {
  const matched = ctx.message.text.match(
    new RegExp(`^\/help@(?<bot>${ctx.botInfo.username})(\\s(?<code>(${Object.keys(messages).join('|')})))?$`),
  )
  if (!matched || !matched.groups) return

  const { msg, keyboard } = getMessage(matched && matched.groups && matched.groups.code)
  console.log(matched, ctx.message.text)
  return ctx.replyWithMarkdown(msg, Extra.markup(keyboard).inReplyTo(ctx.message.message_id))
}

exports.actionPrivate = async ctx => {
  const { title, msg, keyboard } = getMessage(ctx.match.groups.code, ctx.match.groups.parent)

  await ctx.answerCbQuery(title)
  return ctx.editMessageText(msg, Extra.markup(keyboard).markdown(true))
}

exports.actionGroup = async ctx => {
  const {
    from,
    message: { reply_to_message },
  } = ctx.callbackQuery

  if (reply_to_message && reply_to_message.from.id !== from.id)
    return ctx.answerCbQuery(
      `Only for ${[reply_to_message.from.first_name, reply_to_message.from.last_name].filter(n => !!n).join(' ') ||
        (reply_to_message.from.username && `@${reply_to_message.from.username}`)}`,
      { cache_time: 30 },
    )

  const { title, msg, keyboard } = getMessage(ctx.match.groups.code, ctx.match.groups.parent)

  await ctx.answerCbQuery(title)
  return ctx.editMessageText(msg, Extra.markup(keyboard).markdown(true))
}

exports.commandOther = ctx => ctx.reply(`Help: https://t.me/${ctx.botInfo.username}?start=help`)
exports.actionOther = ctx => ctx.answerCbQuery(`Help: https://t.me/${ctx.botInfo.username}?start=help`)

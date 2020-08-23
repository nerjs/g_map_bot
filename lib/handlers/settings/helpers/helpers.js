const { Markup } = require('telegraf')
const { getField } = require('../fields')

exports.clearWaitReply = async ctx => {
  const wr = ctx.getWaitForceReply('settings')

  if (wr && wr.messageId && ctx.chat) {
    ctx.clearWaitForceReply('settings')
    await ctx.telegram.deleteMessage(ctx.chat.id, wr.messageId)
  }
}

exports.editField = async (ctx, fieldName) => {
  const { title, type, replyMsg } = getField(ctx, fieldName)

  const message = await ctx.reply(replyMsg || `Edit ${title}`, Markup.forceReply(true).extra())
  ctx.setWaitForceReply('settings', message, {
    fieldName,
    type,
    settingsMessageId:
      (ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.message_id) ||
      (ctx.message && ctx.message.message_id),
  })
}

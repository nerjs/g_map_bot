const logger = require('nlogs')(module)
const { settingsMessage } = require('./messages')
const { saveField, getField } = require('./fields')
const { buildKeyboard, clearWaitReply, tapAction, backAction, resultAction, editField, getTapMessage } = require('./helpers')
const { UNKNOWN_ERROR, INCORRECT_VALUE } = require('../../messages/errors')

exports.command = async ctx => {
  await clearWaitReply(ctx)
  await ctx.replyWithMarkdown(settingsMessage, buildKeyboard(ctx).extra())
}

exports.actions = async ctx => {
  await clearWaitReply(ctx)
  const { fieldName, position } = (ctx.match && ctx.match.groups) || {}
  if (!fieldName) return backAction(ctx)
  if (!position || isNaN(Number(position))) return tapAction(ctx, fieldName)
  return resultAction(ctx, fieldName, Number(position))
}

exports.editReply = async ctx => {
  const wr = ctx.getWaitForceReply('settings')
  if (!ctx.message || !wr) return ctx.reply(UNKNOWN_ERROR)
  ctx.clearWaitForceReply('settings')

  const { messageId, fieldName, type, settingsMessageId } = wr
  const { title, current } = getField(ctx, fieldName)

  const value = type === 'number' ? Number(ctx.message.text.trim()) : ctx.message.text.trim()

  try {
    if (type === 'number' && isNaN(value)) {
      const err = new Error('Incorrect value')
      err.text = ctx.message.text
      err.value = value
      throw err
    }

    await saveField(ctx, wr.fieldName, value)

    await ctx.replyWithMarkdown(`*Success!* ✅ \n*${title}:*  \`${current}\` ➡️ \`${value}\``)
    await ctx.telegram.deleteMessage(ctx.chat.id, settingsMessageId)
    const { message, extra } = getTapMessage(ctx, fieldName)
    await ctx.replyWithMarkdown(message, extra)
  } catch (e) {
    logger.warn(e)
    await ctx.reply(INCORRECT_VALUE)
    await editField(ctx, fieldName)
  }
}

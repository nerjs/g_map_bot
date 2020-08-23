const { Markup, Extra } = require('telegraf')
const { parseFields, getField, saveField } = require('./fields')
const { settingsMessage } = require('./messages')

const getTapMessage = (ctx, fieldName) => {
  const { title, type, enum: fieldEnum, msg, current } = getField(ctx, fieldName)
  const extra = new Extra()
  let message = msg
  extra.markdown(true)

  if (type === 'bool') {
    message = `${message}\n*Current\:* ${current ? '✅ enabled' : '☑️ disabled'}`
    extra.markup(
      Markup.inlineKeyboard(
        [Markup.callbackButton(`Turn ${current ? 'off' : 'on'}`, `settings:${fieldName}:${current ? 0 : 1}`)],
        { columns: 1 },
      ),
    )
  } else if (type === 'enum') {
    extra.markup(
      Markup.inlineKeyboard(
        fieldEnum
          .map((ef, i) => (ef === current ? null : { title: ef, idx: i }))
          .filter(f => !!f)
          .map(ef => Markup.callbackButton(ef.title, `settings:${fieldName}:${ef.idx}`)),
        { columns: 2 },
      ),
    )
  } else {
    extra.markup(Markup.inlineKeyboard([Markup.callbackButton('Edit', `settings:${fieldName}:1`)], { columns: 1 }))
  }

  extra.reply_markup.inline_keyboard.push([Markup.callbackButton('⬅️ Back', 'settings')])

  if (type !== 'bool') {
    message = `${message}\n*Current\:* \`${current}\``
  }

  return { title, message, extra }
}

const buildKeyboard = ctx =>
  Markup.inlineKeyboard(
    parseFields(ctx).map(({ title, name }) => Markup.callbackButton(title, `settings:${name}`)),
    { columns: 2 },
  )

const clearWaitReply = async ctx => {
  const wr = ctx.getWaitForceReply('settings')

  if (wr && wr.messageId && ctx.chat) {
    ctx.clearWaitForceReply('settings')
    await ctx.telegram.deleteMessage(ctx.chat.id, wr.messageId)
  }
}

const backAction = async ctx => {
  await ctx.answerCbQuery('⬅️ Back to settings!')
  await ctx.editMessageText(settingsMessage, Extra.markup(buildKeyboard(ctx)).markdown(true))
}

const tapAction = async (ctx, fieldName) => {
  const { title, message, extra } = getTapMessage(ctx, fieldName)
  await ctx.answerCbQuery(title)

  await ctx.editMessageText(message, extra)
}

const editField = async (ctx, fieldName) => {
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

const editFieldAction = async (ctx, fieldName) => {
  const { title, type, replyMsg } = getField(ctx, fieldName)
  await ctx.answerCbQuery(`Edit ${title}`)
  await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([Markup.callbackButton('⬅️ Back', 'settings')]))
  await editField(ctx, fieldName)
}

const resultAction = async (ctx, fieldName, position) => {
  const { title, type, enum: fieldEnum, current } = getField(ctx, fieldName)
  let answerMsg = title
  let value

  if (type === 'number' || type === 'string') {
    if (!position) return
    return editFieldAction(ctx, fieldName)
  } else if (type === 'bool') {
    answerMsg = `Turn ${position ? 'on' : 'off'} ${answerMsg}`
    value = !!position
  } else if (type === 'enum') {
    value = fieldEnum[position]
    answerMsg = `${answerMsg}. Check ${value}`
  }

  if (value === current) return

  await saveField(ctx, fieldName, value)
  await ctx.answerCbQuery(answerMsg)

  await tapAction(ctx, fieldName)
}

module.exports = {
  buildKeyboard,
  clearWaitReply,
  getTapMessage,
  backAction,
  tapAction,
  resultAction,
  editField,
}

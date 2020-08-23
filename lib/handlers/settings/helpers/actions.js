const { Markup, Extra } = require('telegraf')
const { getField, saveField } = require('../fields')
const { settingsMessage } = require('../messages')
const { editField } = require('./helpers')
const { getTapMessage, buildKeyboard } = require('./message')

exports.backAction = async ctx => {
  await ctx.answerCbQuery('⬅️ Back to settings!')
  await ctx.editMessageText(settingsMessage, Extra.markup(buildKeyboard(ctx)).markdown(true))
}

exports.tapAction = async (ctx, fieldName) => {
  const { title, message, extra } = getTapMessage(ctx, fieldName)
  await ctx.answerCbQuery(title)

  await ctx.editMessageText(message, extra)
}

exports.editFieldAction = async (ctx, fieldName) => {
  const { title } = getField(ctx, fieldName)
  await ctx.answerCbQuery(`Edit ${title}`)
  await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([Markup.callbackButton('⬅️ Back', 'settings')]))
  await editField(ctx, fieldName)
}

exports.resultAction = async (ctx, fieldName, position) => {
  const { title, type, enum: fieldEnum, current } = getField(ctx, fieldName)
  let answerMsg = title
  let value

  if (type === 'number' || type === 'string') {
    if (!position) return
    return exports.editFieldAction(ctx, fieldName)
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

  await exports.tapAction(ctx, fieldName)
}

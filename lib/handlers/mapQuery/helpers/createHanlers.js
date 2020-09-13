const { Markup, Extra } = require('telegraf')
const { commandSubtype } = require('../../../utils/str')

const waitReply = async (ctx, type, messageText) => {
  const extra = Extra.inReplyTo(ctx.message.message_id).markup(Markup.forceReply(true).selective(true))
  const message = await ctx.reply(messageText, extra)
  ctx.setWaitForceReply(type, message, { messageText })
}

const clearReply = async ctx => {
  const { category } = ctx.waitForceReply || {}
  if (!category) return

  ctx.clearWaitForceReply(category)
}

exports.handlers = {}

exports.createHandler = (category, handler, inputMessageTxt, incorrectTxt) => {
  exports.handlers[category] = handler

  return async ctx => {
    const inputText = commandSubtype(ctx.message.text, ctx.message.entities)
    await clearReply(ctx)

    if (inputText) {
      if (!(await handler(ctx, inputText))) return ctx.reply(incorrectTxt)
    } else {
      return waitReply(ctx, category, inputMessageTxt)
    }
  }
}

exports.createReplyHandler = () => async ctx => {
  const { category } = ctx.waitForceReply
  await clearReply(ctx)
  if (exports.handlers[category]) return exports.handlers[category](ctx, ctx.message.text, true)

  throw new Error(`Unknown category waitForceReply. [category: ${category}]`)
}

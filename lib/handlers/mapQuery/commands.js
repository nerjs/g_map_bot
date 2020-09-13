const { Markup, Extra } = require('telegraf')
const { commandSubtype } = require('../../utils/str')
const searchText = require('./helpers/searchText')
const coordinatesText = require('./helpers/coordinatesText')
const { inputSearchText, inputCoordinatesText } = require('./messages')

const waitReply = async (ctx, type, messageText) => {
  const extra = Extra.inReplyTo(ctx.message.message_id).markup(Markup.forceReply(true).selective(true))
  const message = await ctx.reply(messageText, extra)
  console.log(message)
  ctx.setWaitForceReply(type, message, { messageText })
}

const handlers = {
  search: searchText,
  coordinates: coordinatesText,
}

const clearReply = async ctx => {
  const { category, messageId, messageText } = ctx.waitForceReply || {}

  if (!category) return
  console.log(ctx.waitForceReply, category, { messageId, messageText })
}

exports.replyHandler = async ctx => {
  const { category } = ctx.waitForceReply
  await clearReply(ctx)
  if (handlers[category]) return handlers[category](ctx, ctx.message.text, true)

  throw new Error(`Unknown category waitForceReply. [category: ${category}]`)
}

exports.search = async ctx => {
  const inputText = commandSubtype(ctx.message.text, ctx.message.entities)
  await clearReply(ctx)
  if (inputText) return searchText(ctx, inputText)

  return waitReply(ctx, 'search', inputSearchText)
}

exports.coordinates = async ctx => {
  const inputText = commandSubtype(ctx.message.text, ctx.message.entities)
  await clearReply(ctx)
  if (inputText) return coordinatesText(ctx, inputText)

  return waitReply(ctx, 'coordinates', inputCoordinatesText)
}

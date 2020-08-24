const sendMessage = require('./sendMessage')

module.exports = async ctx => {
  await ctx.result.saveCache()

  await sendMessage(ctx, {
    canLike: true,
    canShare: true,
    canEdit: false,
    replyToMessage: true,
    addToQueue: false,
    sendToGroup: false,
  })
}

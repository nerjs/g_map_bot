const sendMessage = require('./sendMessage')

module.exports = async ctx => {
  await ctx.result.saveDraft()

  await sendMessage(ctx, {
    canLike: false,
    canShare: true,
    canEdit: true,
    replyToMessage: null,
    addToQueue: true,
    sendToGroup: true,
  })
}

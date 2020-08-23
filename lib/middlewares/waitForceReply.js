const logger = require('nlogs')(module)

module.exports = ctx => {
  if (!ctx.session) ctx.session = {}

  Object.defineProperty(ctx, 'waitForceReply', {
    get() {
      if (!ctx.message || !ctx.message.reply_to_message || !ctx.session.__waitForceReply) return null
      if (!Object.keys(ctx.session.__waitForceReply).length) {
        delete ctx.session.__waitForceReply
        return null
      }

      for (let cat in ctx.session.__waitForceReply) {
        if (
          ctx.session.__waitForceReply[cat] &&
          ctx.session.__waitForceReply[cat].messageId === ctx.message.reply_to_message.message_id
        )
          return ctx.session.__waitForceReply[cat]
      }

      return null
    },
  })

  ctx.setWaitForceReply = (category, messageId, options) => {
    if (!category) throw new Error('category is required')
    if (typeof messageId === 'object' && messageId !== null)
      return ctx.setWaitForceReply(category, messageId.message_id, options)
    if (!messageId) throw new Error('messageId is required')

    if (!ctx.session.__waitForceReply) ctx.session.__waitForceReply = {}
    if (options === null) {
      delete ctx.session.__waitForceReply[messageId]
    } else if (typeof options !== 'object') {
      return ctx.setWaitForceReply(category, messageId, { options })
    } else {
      ctx.session.__waitForceReply[category] = { category, messageId, ...options }
    }

    if (!Object.keys(ctx.session.__waitForceReply).length) {
      delete ctx.session.__waitForceReply
    }
  }

  ctx.getWaitForceReply = category => {
    if (!ctx.session.__waitForceReply) return null
    return ctx.session.__waitForceReply[category] || null
  }

  ctx.clearWaitForceReply = category => {
    if (!ctx.session.__waitForceReply) return null
    delete ctx.session.__waitForceReply[category]
  }
}

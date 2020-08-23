const { Composer } = require('telegraf')
const logger = require('nlogs')(module)

exports.compose = fns => (ctx, _next) =>
  new Promise((resolve, reject) => {
    setImmediate(() => {
      const next = _ctx => _next(_ctx)
      const handler = Composer.compose([...fns])
      Promise.resolve(handler(ctx, next))
        .then(resolve)
        .catch(reject)
    })
  })

exports.optional = (predicate, ...fns) => (ctx, next) =>
  Promise.resolve(predicate(ctx)).then(result => {
    const handler = result ? exports.compose(fns) : Composer.safePassThru()
    return handler(ctx, next)
  })

exports.createOptional = predicate => (...fns) => exports.optional(predicate, ...fns)

exports.tap = (...fns) => (ctx, next) =>
  exports
    .compose(fns)(ctx, () => {})
    .then(() => next(ctx))

exports.filter = (predicate, ...fns) => (ctx, next) =>
  Promise.resolve(predicate(ctx)).then(result => {
    const handler = result ? exports.compose(fns) : () => Promise.resolve()
    return handler(ctx, next)
  })

exports.asyncTap = (...fns) => (ctx, next) => {
  setTimeout(() => exports.tap(...fns)(ctx, next), 20)
}

exports.log = (...data) => exports.tap(ctx => logger.debug(...data))

exports.optionalQuery = exports.createOptional(ctx => !!ctx.query)
exports.optionalResult = exports.createOptional(ctx => !!ctx.result)

exports.typing = (action = 'typing') => exports.tap(ctx => ctx.replyWithChatAction(action))

exports.waitReply = (...fns) => exports.optional(ctx => ctx.waitForceReply, ...fns)
exports.waitReplyCategory = (category, ...fns) =>
  exports.optional(ctx => ctx.waitForceReply && ctx.waitForceReply.category === category, ...fns)

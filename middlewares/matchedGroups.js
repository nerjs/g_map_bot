module.exports = (ctx, next) => {
  ctx.vars = ctx.match && ctx.match.groups
  return next(ctx)
}

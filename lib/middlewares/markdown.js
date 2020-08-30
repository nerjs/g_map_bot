// TODO: Лишнее
module.exports = (ctx, next) => {
  ctx.replyWithMarkdown = (markdown, extra = {}) => ctx.reply(markdown, { parse_mode: 'MarkdownV2', ...extra })
  return next(ctx)
}

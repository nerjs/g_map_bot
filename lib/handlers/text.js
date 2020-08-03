const parseQuery = require('./parseQuery')
const { UNDEFINED_ERROR } = require('../messages/short')

module.exports = async ctx => {
  const emptyMessage = () => ctx.reply(UNDEFINED_ERROR)
  await parseQuery(ctx.message.text, ctx, { emptyQuery: emptyMessage, emptyResult: emptyMessage })
}

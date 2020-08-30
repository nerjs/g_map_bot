const searchText = require('./helpers/searchText')

module.exports = async ctx => {
  return searchText(ctx, ctx.message.text)
}

const searchText = require('./helpers/searchText')
const { commandSubtype } = require('../../utils/str')

exports.search = async ctx => {
  const inputTxt = commandSubtype(ctx.message.text, ctx.message.entities)
  return searchText(ctx, inputTxt)
}

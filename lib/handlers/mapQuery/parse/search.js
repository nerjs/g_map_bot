const Request = require('../helpers/MapQuery/Request')
const { incorrectSearch } = require('../messages')
const { SEARCH_TEXT } = require('../../../constants')

module.exports = ctx => {
  if (
    !ctx.queryCommandSubtext ||
    ctx.queryCommandSubtext.length < SEARCH_TEXT.MIN ||
    ctx.queryCommandSubtext.length > SEARCH_TEXT.MAX
  )
    return ctx.mapQuery.setError(incorrectSearch)

  ctx.mapQuery.setRequest({
    type: Request.TYPES.SEARCH,
    query: ctx.queryCommandSubtext,
  })
}

const Request = require('../helpers/MapQuery/Request')
const { incorrectRandomSubtype } = require('../messages')

module.exports = async ctx => {
  const subtype = (ctx.queryCommandSubtext || Request.SUBTYPES[Request.TYPES.RANDOM].PHOTO).toUpperCase()

  if (!Request.SUBTYPES[Request.TYPES.RANDOM][subtype]) return ctx.mapQuery.setError(incorrectRandomSubtype)

  return ctx.mapQuery.setRequest({
    type: Request.TYPES.RANDOM,
    subtype,
  })
}

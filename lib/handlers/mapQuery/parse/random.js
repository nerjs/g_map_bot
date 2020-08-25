const Request = require('../helpers/MapQuery/Request')
const { commandSubtype } = require('../../../utils/str')

module.exports = async ctx => {
  const subtype = (
    commandSubtype(ctx.message.text, ctx.message.entities) || Request.SUBTYPES[Request.TYPES.RANDOM].PHOTO
  ).toUpperCase()

  if (!Request.SUBTYPES[Request.TYPES.RANDOM][subtype])
    return ctx.mapQuery.setError(
      `Incorrect value. \nSupported: ${Object.values(Request.SUBTYPES[Request.TYPES.RANDOM]).join(', ')}`,
    )

  return ctx.mapQuery.setRequest({
    type: Request.TYPES.RANDOM,
    subtype,
  })
}

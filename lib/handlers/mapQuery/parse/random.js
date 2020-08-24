const Request = require('../helpers/MapQuery/Request')
const { commandSubtype } = require('../../../utils/str')

module.exports = async ctx => {
  ctx.mapQuery.setRequest({
    type: Request.TYPES.RANDOM,
    subtype: (
      commandSubtype(ctx.message.text, ctx.message.entities) || Request.SUBTYPES[Request.TYPES.RANDOM].PHOTO
    ).toUpperCase(),
  })
}

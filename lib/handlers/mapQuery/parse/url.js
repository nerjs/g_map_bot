const needle = require('needle')
const logger = require('nlogs')(module)
const UrlParser = require('../../../utils/UrlParser')
const { incorrectUrl } = require('../messages')
const { urlErrorHandler } = require('../../../utils/cache')
const Request = require('../helpers/MapQuery/Request')

const requestShorted = async url => {
  const { statusCode, headers } = await needle('head', url)

  if (statusCode !== 302 || !headers.location) return null

  return (statusCode === 302 && headers.location) || null
}

module.exports = async ctx => {
  if (!ctx.queryCommandSubtext) return ctx.mapQuery.setError(incorrectUrl)

  const url = /^https?:\/\/goo\.gl/.test(ctx.queryCommandSubtext)
    ? await requestShorted(ctx.queryCommandSubtext)
    : ctx.queryCommandSubtext

  const parsedUrl = new UrlParser(url)

  if (!parsedUrl.success) return ctx.mapQuery.setError(incorrectUrl)
  urlErrorHandler.add(parsedUrl).catch(logger.error)

  ctx.mapQuery.setRequest({
    type: Request.TYPES.URL,
    ...parsedUrl.toJSON(),
  })
}

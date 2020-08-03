const { inlineCache } = require('../utils/cache')
const QueryParser = require('../utils/QueryParser')
const QueryResult = require('../utils/QueryResult')
const ResultMessage = require('../utils/ResultMessage')

const getFn = (fn, ctx) => fn && typeof fn === 'function' && fn(ctx)

/**
 *
 * @param {String} str query string
 * @param {Object} ctx context
 * @param {Object} option callbacks
 * @param {Function} options.emptyQuery Empty query function
 * @param {Function} options.noConsist No consist function
 * @param {Function} options.emptyResult Empty result function
 */
module.exports = async (str, ctx, options = {}) => {
  const query = await QueryParser.parse(str)
  if (!query.hasResult) return getFn(options.emptyQuery, ctx)

  const isConsist = await inlineCache.setConsist(ctx, { query })

  const result = await QueryResult.result(query)

  if (!(await isConsist())) return getFn(options.noConsist, ctx)
  if (!result.hasResult) return getFn(options.emptyResult, ctx)

  const message = new ResultMessage(result, ctx)

  return message.send()
}

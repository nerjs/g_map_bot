const { isIdQuery, isCacheQuery, isFormatQuery } = require('./isQuery')
const { parseQueryString } = require('./parseQuery')

const buildQueryString = ({ type, subType, id, subId, lat, lng, zoom } = {}) =>
  [type, subType, id, subId, lat, lng, zoom].filter(v => !!v).join(SEP)

const buildQueryId = props => {
  str = buildQueryString(props)
  return isIdQuery(parseQueryString(str)) ? str : null
}

const buildQueryCache = props => {
  str = buildQueryString(props)
  return isCacheQuery(parseQueryString(str)) ? str : null
}

const buildQueryFormat = props => {
  str = buildQueryString(props)
  return isFormatQuery(parseQueryString(str)) ? str : null
}

module.exports = {
  buildQueryString,
  buildQueryId,
  buildQueryCache,
  buildQueryFormat,
}

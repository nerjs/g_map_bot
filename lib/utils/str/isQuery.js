const { QUERY_TYPES, TYPES_SCHEMA, URL_REQEXP, SEARCH_MIN_LENGTH } = require('./constants')

const isString = str => !!(str && typeof str === 'string' && str.trim())

const isUrl = str => isString(str) && URL_REQEXP.test(str)

const isSearchString = str => isString(str) && str.trim().length >= SEARCH_MIN_LENGTH

const isIdQuery = query =>
  query.type === QUERY_TYPES.ID && query.sybType && TYPES_SCHEMA[QUERY_TYPES.ID].includes(query.subType) && query.id

const isCacheQuery = query =>
  query.type === QUERY_TYPES.CACHE && (!query.sybType || TYPES_SCHEMA[QUERY_TYPES.CACHE].includes(query.subType)) && query.id

const isFormatQuery = query => query.type === QUERY_TYPES.FORMAT && query.lat && query.lng

const isUrlQuery = query => query.type === QUERY_TYPES.URL && query.url && isUrl(query.url)

module.exports = {
  isString,
  isUrl,
  isSearchString,
  isIdQuery,
  isCacheQuery,
  isFormatQuery,
  isUrlQuery,
}

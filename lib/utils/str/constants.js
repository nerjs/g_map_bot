/**
 * id:draft|queue:{24}:{24}
 * cache:place:{24}:{24}
 * format:(m|s)|{lat}|{lng}|{zoom}?
 */

exports.QUERY_TYPES = {
  ID: 'id',
  CACHE: 'cache',
  FORMAT: 'format',
  SEARCH: 'search',
  URL: 'url',
}

exports.SEP = '_'
exports.SEP_REGEXP = `(${exports.SEP}|\s)`
exports.TYPES = [exports.QUERY_TYPES.ID, exports.QUERY_TYPES.CACHE, exports.QUERY_TYPES.FORMAT]
exports.TYPES_SCHEMA = {
  [exports.QUERY_TYPES.ID]: ['draft', 'queue'],
  [exports.QUERY_TYPES.CACHE]: ['place'],
}

exports.MAPTYPES = ['m', 's']

exports.URL_REQEXP = /^https?:\/\/(.*)+/

exports.SEARCH_MIN_LENGTH = 3

exports.SUBTYPES = Object.keys(exports.TYPES_SCHEMA)
  .map(key => exports.TYPES_SCHEMA[key] || [])
  .flat()

exports.QS_REGEXP = (() => {
  const { TYPES, SUBTYPES, SEP_REGEXP, MAPTYPES } = exports
  const typesStr = `(?<type>(${TYPES.join('|')}))`
  const subTypesStr = `(?<subType>(${SUBTYPES.join('|')}))`
  const idStr = `((?<id>[0-9a-z]{24})(${SEP_REGEXP}(?<subId>[0-9a-z]{24}))?(${SEP_REGEXP}(?<position>[0-9]+))?)`
  const formatStr = `((?<mapType>(${MAPTYPES.join(
    '|',
  )}))${SEP_REGEXP}(?<lat>[0-9\.]+)${SEP_REGEXP}(?<lng>[0-9\.]+(${SEP_REGEXP}(?<zoom>[0-9]{1,2}))?))`

  const regStr = `^${typesStr}(${SEP_REGEXP}${subTypesStr})?${SEP_REGEXP}${idStr}|${formatStr}$`
  return new RegExp(regStr)
})()

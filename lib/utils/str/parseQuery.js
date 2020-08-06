const { QS_REGEXP, QUERY_TYPES } = require('./constants')
const { isString, isUrl, isSearchString, isIdQuery, isCacheQuery, isFormatQuery } = require('./isQuery')

exports.parseQueryString = _str => {
  if (!isString(_str)) return null
  const str = _str.trim()
  const matched = str.match(QS_REGEXP)

  if (!matched || !matched.groups) {
    if (isUrl(str))
      return {
        type: QUERY_TYPES.URL,
        [QUERY_TYPES.URL]: str,
      }

    if (isSearchString(str))
      return {
        type: QUERY_TYPES.SEARCH,
        [QUERY_TYPES.SEARCH]: str,
      }

    return null
  }
  if (!matched.groups.type) return null

  if (isIdQuery(matched.groups) || isCacheQuery(matched.groups) || isFormatQuery(matched.groups))
    return { ...matched.groups }

  return null
}

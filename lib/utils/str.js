const {
  Types: { ObjectId },
} = require('mongoose')

exports.isString = str => !!(str && typeof str === 'string' && str.trim())

const urlRegexp = /^https?:\/\/(.*)+/
exports.isUrl = str => exports.isString(str) && urlRegexp.test(str.trim())

const idRegexp = /^id:(draft|queue):[a-z0-9]{0,24}$/
exports.isId = str => exports.isString(str) && idRegexp.test(str)

const idFullRegexp = /^id:(?<type>(draft|queue)):(?<id>[a-z0-9]{24})$/
exports.getIdFromStr = str => {
  if (!exports.isString(str)) return {}
  const matched = str.match(idFullRegexp)
  if (!matched || !matched.groups || !matched.groups.id) return {}
  return { id: matched.groups.id, type: matched.groups.type || 'draft' }
}

const cacheRegexp = /^cache_(?<cache>[a-z0-9]{24})$/
exports.createCacheId = id => `cache_${id}`
exports.getCacheId = str => {
  if (!exports.isString(str)) return null
  const matched = str.match(cacheRegexp)

  return matched && matched.groups && matched.groups.cache
}

exports.isSearch = str => exports.isString(str) && str.length > 3 && str.length < 255

exports.getId = () => `${new ObjectId()}`

const Cache = require('./base')
const { REDIS_DBS, TTL } = require('../../constants')

exports.inlineCache = new Cache(REDIS_DBS.INLINE_CACHE, TTL.INLINE_CACHE)

const Cache = require('./base')
const { REDIS_DBS, TTL } = require('../../constants')

exports.inlineCache = new Cache(REDIS_DBS.INLINE_CACHE, TTL.INLINE_CACHE)
exports.debounceCache = new Cache(REDIS_DBS.DEBOUNCE, TTL.DEBOUNCE)
exports.filesCache = new Cache(REDIS_DBS.FILES, TTL.FILES)
exports.placesCache = new Cache(REDIS_DBS.PLASES, TTL.PLACES)
exports.resultCache = new Cache(REDIS_DBS.RESULT, TTL.RESULT)

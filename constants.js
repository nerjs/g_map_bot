// 0-15
exports.REDIS_DBS = {
  DEFAULT: 0,
  TG_SESSION: 1,
  INLINE_CACHE: 2,
}

// in sec
exports.TTL = {
  DEFAULT: 60 * 60 * 24 * 60,
  TG_SESSION: 60 * 60 * 24 * 10,
  INLINE_CACHE: 60 * 60,
}

// in sec
exports.CACHE_TIME = {
  INLINE_EMPTY: 2,
  INLINE_HAS_RESULT: 2,
}

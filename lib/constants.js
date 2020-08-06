// 0-15
exports.REDIS_DBS = {
  DEFAULT: 0,
  TG_SESSION: 1,
  INLINE_CACHE: 2,
  DEBOUNCE: 3,
  FILES: 4,
  PLASES: 5,
  RESULT: 6,
  SHORT_IDS: 7,
}

// in sec
exports.TTL = {
  DEFAULT: 60 * 60 * 24 * 60,
  TG_SESSION: 60 * 60 * 24 * 10,
  INLINE_CACHE: 60 * 60,
  DEBOUNCE: 60,
  FILES: 60 * 60 * 24,
  PLACES: 60 * 60 * 24 * 2,
  RESULT: 60 * 60,
  SHORT_IDS: 60 * 60 * 24 * 10,
}

// in sec
exports.CACHE_TIME = {
  INLINE_EMPTY: 2,
  INLINE_HAS_RESULT: 2,
}

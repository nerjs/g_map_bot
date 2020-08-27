// 0-15
exports.REDIS_DBS = {
  DEFAULT: 0,
  TG_SESSION: 1,
  SHORT_IDS: 2,
  URL_PARSER_ERRORS: 3,
  // INLINE_CACHE: 2,
  // DEBOUNCE: 3,
  // FILES: 4,
  // PLASES: 5,
  // RESULT: 6,
}

// in sec
exports.TTL = {
  DEFAULT: 60 * 60 * 24 * 60,
  TG_SESSION: 60 * 60 * 24 * 10,
  // INLINE_CACHE: 60 * 60,
  // DEBOUNCE: 60,
  // FILES: 60 * 60 * 24,
  // PLACES: 60 * 60 * 24 * 2,
  // RESULT: 60 * 60,
  SHORT_IDS: 60 * 60 * 24 * 10,
  URL_PARSER_ERRORS: 60 * 60 * 24 * 30,
}

// in sec
exports.CACHE_TIME = {
  INLINE_EMPTY: 2,
  INLINE_HAS_RESULT: 2,
}

exports.MAP_TYPES = {
  ROADMAP: 'ROADMAP',
  SATELLITE: 'SATELLITE',
  TERRAIN: 'TERRAIN',
  HYBRID: 'HYBRID',
}

exports.DEFAULT_DESCRIPTION_FORMAT = '{{lat}}:{{lng}}'
exports.DEFAULT_ZOOM = 13

exports.SEARCH_TEXT = {
  MIN: 3,
  MAX: 30,
}

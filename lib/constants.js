// 0-15
exports.REDIS_DBS = {
  TG_SESSION: 0,
  MAP_CACHE: 1,
  SHORT_IDS: 3,
  DEFAULT: 5,
  // URL_PARSER_ERRORS: 3,
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

  CHANGELOG: 60 * 60 * 24 * 120,
  SEARCH_CACHE: 60,
  PLACE: 60 * 60,
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
  MIN: 2,
  MAX: 30,
}

exports.RANDOM_SUBTYPES = {
  MAP: 'map',
  SATELLITE: 'satellite',
  PLACE: 'place',
  PHOTO: 'photo',
  STREET: 'street',
  PANORAMA: 'panorama',
}

exports.COORDINATES_FORMAT = {
  TYPES: {
    MAP: 'map',
    SATELLITE: 'satellite',
    PHOTO: 'photo',
  },
  NOT_EXISTS_TYPES: {
    MAP: 'map',
    SATELLITE: 'satellite',
  },
}

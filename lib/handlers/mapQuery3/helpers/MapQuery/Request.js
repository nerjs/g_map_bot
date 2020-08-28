const { optional } = require('../../../../utils/helpers')

const TYPES = {
  RANDOM: 'RANDOM',
  COORDS: 'COORDS',
  URL: 'URL',
  SEARCH: 'SEARCH',
}

const SUBTYPES = {
  [TYPES.RANDOM]: {
    MAP: 'map',
    SATELLITE: 'satellite',
    PLACE: 'place',
    PHOTO: 'photo',
    STREET: 'street',
    PANORAMA: 'panorama',
  },
  [TYPES.COORDS]: {
    MAP: 'map',
    SATELLITE: 'satellite',
    PHOTO: 'photo',
  },
}

class MapQueryRequest {
  constructor(props = {}) {
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
  }

  get correct() {
    return !!(
      this.type &&
      TYPES[this.type] &&
      (!SUBTYPES[this.type] || SUBTYPES[this.type][this.subtype]) &&
      (() => {
        return true
      })()
    )
  }

  static TYPES = TYPES

  static SUBTYPES = SUBTYPES

  static optional(type, ...fns) {
    return optional(ctx => ctx.mapQuery && ctx.mapQuery.request && ctx.mapQuery.request.type === type, ...fns)
  }
}

module.exports = MapQueryRequest

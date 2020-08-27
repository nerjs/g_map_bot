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
}

module.exports = MapQueryRequest

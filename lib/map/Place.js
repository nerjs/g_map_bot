const logger = require('nlogs')(module)
const ApiCache = require('./ApiCache')
const PlaceApi = require('./api/PlaceApi')
const details = require('./helpers/details')
const { MAP_TYPES, DEFAULT_ZOOM } = require('../constants')
const StaticApi = require('./api/StaticApi')

class Place {
  constructor(doc, settings) {
    this.doc = doc
    this.settings = settings
    ;['id', 'placeId', 'lang', 'title', 'description', 'location', 'url', 'photos'].forEach(key => {
      this[key] = doc[key]
    })
  }

  getMap(type) {
    if (!type) return this.getMap(this.settings.mapType || MAP_TYPES.ROADMAP)
    if (!MAP_TYPES[type]) throw new Error(`Incorrect map type. type: ${type}`)

    const saved = this.doc.maps.find(m => m.zoom === this.settings.defaultZoom && m.mapType === type)
    if (saved) return saved.toObject()

    const staticApi = new StaticApi({ lang: this.lang })

    const params = {
      type: `${type}`.toLowerCase(),
      ...this.doc.location.toObject(),
      ...((this.doc.viewport && { viewport: this.doc.viewport.toObject({ virtuals: true }) }) || {
        zoom: this.settings.defaultZoom,
      }),
    }

    const map = {
      mapType: type,
      zoom: this.settings.defaultZoom,
      large: staticApi.mapImgLarge(params),
      thumb: staticApi.mapImgThumb(params),
      notSaved: true,
    }

    return map
  }

  async setTg(original, tgPhotos = []) {
    if (!original || !original.large || !original.thumb || !tgPhotos || !tgPhotos.length) {
      console.error('Incorrecr setTg arguments', { original, tgPhotos })
      return null
    }

    if (original.large.tgId && original.thumb.tgId) return false
    const tgP = tgPhotos
      .map(({ width, height, file_id }) => ({ width, height, tgId: file_id }))
      .reduce(
        (prev, cur) => {
          if (!prev.large || prev.large.width < cur.width || prev.large.height < cur.height) prev.large = cur
          if (!prev.thumb || prev.thumb.width > cur.width || prev.thumb.height > cur.height) prev.thumb = cur
          return prev
        },
        { large: null, thumb: null },
      )

    if (original.mapType) {
      this.doc.maps.push({
        ...original,
        large: { ...original.large, ...tgP.large },
        thumb: { ...original.thumb, ...tgP.thumb },
      })
    } else if (original.id) {
      const photo = this.doc.photos.find(p => p.id === original.id)
      if (!photo) return logger.warn('Photo not found', original)
      photo.large = { ...photo.large.toObject(), ...tgP.large }
      photo.thumb = { ...photo.thumb.toObject(), ...tgP.thumb }
    } else {
      logger.warn('Undefinet original photo type', original)
      return null
    }

    await this.doc.save()

    return true
  }

  static cache = new ApiCache('place')

  static async find({ count = 100, ...params }) {
    if (!params || !Object.keys(params).length) return []

    const placeApi = new PlaceApi({ lang: params.lang })

    let pls = []

    const cached = await this.cache.get(JSON.stringify(params))

    if (cached) {
      pls = cached
    } else {
      pls = ((await placeApi.autocomplete(params)) || []).map(({ description, place_id, structured_formatting }) => ({
        description,
        place_id,
        structured_formatting,
      }))
      await this.cache.set(JSON.stringify(params), pls)
    }

    const places = (pls || []).filter((_, i) => i < count)

    return (await Promise.all(places.map(async pl => details(pl, params.lang))))
      .filter(doc => !!doc)
      .map(doc => new Place(doc, params))
  }

  static async findOne(params) {
    return (await this.find({ ...params, count: 1 }))[0] || null
  }

  static search(text, options = {}) {
    return this.find({ input: text, count: 10, ...options })
  }

  static searchOne(text, options = {}) {
    return this.findOne({ input: text, ...options })
  }
}

module.exports = Place

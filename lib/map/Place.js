const logger = require('nlogs')(module)
const ApiCache = require('./ApiCache')
const PlaceApi = require('./api/PlaceApi')
const details = require('./helpers/details')
const { MAP_TYPES, DEFAULT_ZOOM } = require('../constants')
const StaticApi = require('./api/StaticApi')
const GeocodingApi = require('./api/GeocodingApi')
const createDetail = require('./helpers/createDetail')

class Place {
  constructor(doc, settings) {
    this.doc = doc
    this.settings = settings
    ;['id', 'placeId', 'lang', 'title', 'description', 'location', 'url', 'photos'].forEach(key => {
      this[key] = doc[key]
    })
  }

  getMap(type, zoom) {
    if (!type) return this.getMap(this.settings.mapType || MAP_TYPES.ROADMAP)
    if (!MAP_TYPES[type]) throw new Error(`Incorrect map type. type: ${type}`)

    const finalZoom =
      zoom ||
      (this.doc.viewport &&
        StaticApi.zoomFromViewport(this.doc.viewport.ne, this.doc.viewport.sw, StaticApi.sizes.large.WIDTH)) ||
      this.settings.defaultZoom

    const saved = this.doc.maps.find(m => m.zoom === finalZoom && m.mapType === type)
    if (saved) return saved.toObject()

    const staticApi = new StaticApi({ lang: this.lang })

    const params = {
      maptype: `${type}`.toLowerCase(),
      ...this.doc.location.toObject(),
      zoom: finalZoom,
    }

    const map = {
      mapType: type,
      zoom: params.zoom,
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

  static async __find(params = {}) {
    const apiParams = { lang: params.lang }

    if (params.input) {
      const placeApi = new PlaceApi(apiParams)
      return placeApi.autocomplete(params)
    } else if (params.address || params.latlng) {
      const geocodingApi = new GeocodingApi(apiParams)
      return geocodingApi[params.address ? 'geocode' : 'reverseGeocode'](params)
    }
  }

  static async find({ count = 100, ...params }) {
    if (!params || !Object.keys(params).length) return []

    let pls = []

    const cached = await this.cache.get(JSON.stringify(params))

    if (cached) {
      pls = cached
    } else {
      pls = ((await this.__find(params)) || []).map(
        ({ description, place_id, structured_formatting, formatted_address }) => ({
          description,
          place_id,
          structured_formatting,
          formatted_address,
        }),
      )
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

  static async coordinates(lat, lng, options = {}) {
    const res = await this.find({
      latlng: `${lat},${lng}`,
      count: 10,
      ...options,
      location_type: 'ROOFTOP|GEOMETRIC_CENTER',
    })

    if (!res) return []

    return res
  }

  static async coordinatesOne(lat, lng, options = {}) {
    return (await this.coordinates(lat, lng, { ...options, count: 1 }))[0] || null
  }

  static async createDetail(params) {
    return new Place(await createDetail(params), params)
  }
}

module.exports = Place

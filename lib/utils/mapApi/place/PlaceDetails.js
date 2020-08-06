const { placesCache } = require('../../cache')
const Out = require('../Out')
const StaticApi = require('../StaticApi')
const PlacePhoto = require('./PlacePhoto')
const MapPhoto = require('../MapPhoto')

class PlaseDetailsOut {
  constructor({ api, cache, predictionId, _loaded, ...obj }) {
    Object.assign(this, obj)
  }
}

class PlaceDetails extends Out {
  constructor(prop, api) {
    super(PlaseDetailsOut)

    if (typeof prop === 'string') {
      this.id = prop
    } else {
      const { description, id, place_id } = prop
      this.id = place_id
      this.title = description
      this.predictionId = id
    }

    this.photos = []

    this.api = api
    this.cache = placesCache
  }

  get correct() {
    return !!(this.lat && this.lng && this.url && this.title)
  }

  get loaded() {
    return !!this._loaded
  }

  async save() {
    await this.cache.set(this.id, this)
    return this
  }

  async load() {
    const cached = await this.cache.get(this.id)
    if (cached) {
      if (this.title && this.title !== cached.title) {
        cached.title = this.title
      }
      Object.keys(cached).forEach(key => {
        this[key] = cached[key]
      })
    }

    let formatted_address
    if (!this.correct) {
      const details = await this.loadById()

      if (details) {
        if (details.geometry) {
          const {
            location: { lat, lng },
            viewport,
          } = details.geometry

          this.lat = lat
          this.lng = lng

          if (viewport) {
            this.viewport = viewport
          }
        }

        formatted_address = details.formatted_address

        this.url = details.url

        this.photos = details.photos

        this.title = this.title || details.formatted_address || details.name
      }
    }

    this.mapImg = new MapPhoto({ lat: this.lat, lng: this.lng, visible: formatted_address }, this.api)

    this.photos = (this.photos || []).map(photo => new PlacePhoto(photo, this.api))

    await this.save()

    this._loaded = true
  }

  async loadById() {
    const { result } = await this.api.callApi('placeDetails', { place_id: this.id })

    return result || null
  }

  async addTgPhoto({ index, photo_reference, large, thumb }) {
    if ((!photo_reference && (isNaN(Number(index)) || index < 0)) || (!large && !thumb))
      throw new Error(`Incorrect addTgPhoto() arguments`)

    if (!this.loaded) {
      await this.load()
    }

    const idx = photo_reference ? this.photos.findIndex(photo => photo.photo_reference === photo_reference) : index

    if (isNaN(Number(idx)) || idx < 0 || !this.photos[idx]) return false

    if (large) this.photos[idx].large.tg = large
    if (thumb) this.photos[idx].thumb.tg = img

    await this.save()

    return true
  }
}

module.exports = PlaceDetails

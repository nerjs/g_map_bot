const { placesCache } = require('../cache')
const Out = require('../Out')
const { relationCoords } = require('./helpers')
const { IMG, THUMB } = require('./constants')

class PlaceDetails extends Out {
  constructor(prop, api) {
    super()

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

    if (!this.correct) {
      const details = await this.api.placeDetailsById(this.id)
      this.details = details
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

        this.url = details.url

        this.photos = (details.photos || []).map(photo => this.preparePhoto(photo)).filter(p => !!p)

        this.title = this.title || details.formatted_address || details.name
      }
    }

    await this.save()

    this._loaded = true
  }

  preparePhoto({ img, thumb, photo_reference, width, height }) {
    if (img && thumb) return { img, thumb }
    if (img && !thumb) return this.preparePhoto({ ...img, photo_reference })
    if (!photo_reference) return null

    const imgSizes = relationCoords(width, height, IMG.WIDTH, IMG.HEIGHT)
    const thumbSizes = relationCoords(width, height, THUMB.WIDTH, THUMB.HEIGHT)

    return {
      photo_reference,
      img: {
        url: this.api.buildPlacePhotoLink(photo_reference, imgSizes.width, imgSizes.height),
        ...imgSizes,
      },
      thumb: {
        url: this.api.buildPlacePhotoLink(photo_reference, thumbSizes.width, thumbSizes.height),
        ...thumbSizes,
      },
    }
  }

  async addTgPhoto({ index, photo_reference, img, thumb }) {
    if ((!photo_reference && (isNaN(Number(index)) || index < 0)) || (!img && !thumb))
      throw new Error(`Incorrect addTgPhoto() arguments`)

    if (!this.loaded) {
      await this.load()
    }

    const idx = photo_reference ? this.photos.findIndex(photo => photo.photo_reference === photo_reference) : index

    if (isNaN(Number(idx)) || idx < 0 || !this.photos[idx]) return false

    if (img) this.photos[idx].img.tg = img
    if (thumb) this.photos[idx].thumb.tg = img

    await this.save()

    return true
  }

  out() {
    const { api, cache, predictionId, _loaded, ...obj } = this
    return obj
  }
}

module.exports = PlaceDetails

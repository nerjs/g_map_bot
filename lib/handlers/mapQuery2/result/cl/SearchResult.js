const logger = require('nlogs')(module)
const Result = require('./Result')
const { PlaceApi } = require('../../../../utils/mapApi')

class SearchResult extends Result {
  constructor({ search }, ctx) {
    super(ctx)
    this.search = search
    this.api = new PlaceApi(this.apiProps)

    this.currentPlace = null
    this.currentPhoto = -1
  }

  async load() {
    this.places = await this.api.input(this.search)
    if (!this.places.length) return

    this.currentPlace = this.places[0]

    await this.currentPlace.load()

    if (!this.currentPlace.correct) return

    const { lat, lng, mapImg, photos, title, url } = this.currentPlace

    this.lat = lat
    this.lng = lng
    this.url = url
    this.title = title

    if (photos && photos.length) {
      this.large = photos[0].large
      this.thumb = photos[0].thumb
      this.currentPhoto = 0
    } else {
      this.large = mapImg.large
      this.thumb = mapImg.thumb
    }
  }

  async loadVariants(count = 4) {
    if (!this.ready) {
      await this.load()
    }

    if (!this.ready) return []

    const variants = []
    const firstItem = this.toObject()
    const secondtItem = this.toObject()

    if (this.currentPhoto >= 0) {
      firstItem.id = `place:id:${this.currentPlace.id}`
      secondtItem.id = `place:map:${this.currentPlace.id}`

      secondtItem.large = this.currentPlace.mapImg.large
      secondtItem.thumb = this.currentPlace.mapImg.thumb
      secondtItem.title = `(MAP) ${secondtItem.title}`

      variants.push(firstItem, secondtItem)
    } else {
      firstItem.id = `place:map:${this.currentPlace.id}`
      firstItem.title = `(MAP) ${firstItem.title}`

      variants.push(firstItem)

      if (this.currentPlace.photos && this.currentPlace.photos.length) {
        secondtItem.id = `place:id:${this.currentPlace.id}`

        secondtItem.large = this.currentPlace.photos[0].large
        secondtItem.thumb = this.currentPlace.photos[0].thumb

        variants.push(secondtItem)
      }
    }

    if (this.places.length) {
      const dopCount = count - variants.length

      variants.push(
        ...(await Promise.all(
          this.places
            .filter(pl => pl !== this.currentPlace)
            .filter((pl, i) => i < dopCount)
            .map(async place => {
              await place.load()

              let large, thumb

              if (place.photos && place.photos.length) {
                large = place.photos[0].large
                thumb = place.photos[0].thumb
              } else {
                large = place.mapImg.large
                thumb = place.mapImg.thumb
              }

              return {
                id: `place:id:${place.id}`,
                title: place.title,
                lat: place.lat,
                lng: place.lng,
                url: place.url,
                large,
                thumb,
              }
            }),
        )),
      )
    }

    return variants
  }

  toObject() {
    const { api, places, currentPlace, ...obj } = super.toObject()

    if (places && places.length) {
      obj.places = places.map(place => ({ id: place.id, title: place.title }))
    }

    if (currentPlace) {
      obj.currentPlace = currentPlace.id
    }

    return obj
  }
}

module.exports = SearchResult

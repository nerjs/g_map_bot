const { Client } = require('@googlemaps/google-maps-services-js')
const qs = require('qs')
const { wrap } = require('./helpers')
const Place = require('./Place')

class MapApi {
  constructor({ lang }) {
    this.lang = lang
    this.key = process.env.GOOGLE_MAPS_API_KEY
    this.client = new Client({})
  }

  getParams(params = {}) {
    return { params: { ...params, key: this.key, language: this.lang } }
  }

  clientplaceAutocomplete(params) {
    return wrap(() => this.client.placeAutocomplete(this.getParams(params)))
  }

  clientPaseDetails(params) {
    return wrap(() => this.client.placeDetails(this.getParams(params)))
  }

  clientPlacePhoto(params) {
    return wrap(() => this.client.placePhoto(this.getParams(params)))
  }

  async placeAutocomplete(params) {
    const { predictions } = await this.clientplaceAutocomplete(params)

    return predictions || []
  }

  async inputPlace(str) {
    const predictions = await this.placeAutocomplete({ input: str })

    return predictions.map(prediction => new Place(prediction, this))
  }

  async locationPlace(lat, lng) {
    // TODO: feature
  }

  async placeDetails(params = {}) {
    const { result } = await this.clientPaseDetails(params)

    return result || null
  }

  async placeDetailsById(placeId) {
    return this.placeDetails({ place_id: placeId })
  }

  async placePhoto(params = {}) {
    return this.clientPlacePhoto(params)
  }

  buildPlacePhotoLink(photoreference, maxwidth, maxheight) {
    return `https://maps.googleapis.com/maps/api/place/photo?${qs.stringify({
      key: this.key,
      photoreference,
      maxwidth,
      maxheight,
    })}`
  }
}

module.exports = MapApi

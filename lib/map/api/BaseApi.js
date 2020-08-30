class BaseApi {
  constructor(obj) {
    const { lang, key, url } = obj || {}

    this.lang = lang || 'en'
    this.key = key || process.env.GOOGLE_MAPS_API_KEY
    this.url = url || 'https://maps.googleapis.com/maps/api/'
  }
}

module.exports = BaseApi

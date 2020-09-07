const BaseClientApi = require('./BaseClientApi')

class GeocodingApi extends BaseClientApi {
  async geocode(params) {
    const { results } = await this.callApi('geocode', params)

    return results || []
  }

  async reverseGeocode(params) {
    const { results } = await this.callApi('reverseGeocode', params)
    return results || []
  }
}

module.exports = GeocodingApi

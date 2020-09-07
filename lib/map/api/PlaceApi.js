const BaseClientApi = require('./BaseClientApi')

class PlaceApi extends BaseClientApi {
  async autocomplete(params) {
    const { predictions } = await this.callApi('placeAutocomplete', params)

    return predictions || []
  }

  async loadDetails(placeId, fields = []) {
    const params = { place_id: placeId }

    if (fields && (Array.isArray(fields) || typeof fields === 'string') && fields.length) {
      params.fields = typeof fields === 'string' ? fields : fields.join(',')
    }

    const { result } = await this.callApi('placeDetails', params)

    return result || null
  }
}

module.exports = PlaceApi

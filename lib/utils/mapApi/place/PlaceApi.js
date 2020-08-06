const BaseApi = require('../BaseApi')
const PlaceDetails = require('./PlaceDetails')

class PlaceApi extends BaseApi {
  constructor(params) {
    super(params)
  }

  async autocomplete(params) {
    const { predictions } = await this.callApi('placeAutocomplete', params)

    return predictions || []
  }

  async input(str) {
    const predictions = await this.autocomplete({ input: str })

    return predictions.map(prediction => new PlaceDetails(prediction, this))
  }
}

module.exports = PlaceApi

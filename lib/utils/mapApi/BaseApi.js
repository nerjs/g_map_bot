const { Client } = require('@googlemaps/google-maps-services-js')
const MapApiError = require('./error')
const PreBaseApi = require('./PreBaseApi')

class BaseApi extends PreBaseApi {
  constructor(props) {
    super(props)
    this.client = new Client({})
  }

  preparaParams(params = {}) {
    return { params: { ...params, key: this.key, language: this.lang } }
  }

  async callApi(methodName, params) {
    if (!methodName || !this.client[methodName]) throw new Error(`Incorrect method name ( ${methodName} )`)

    try {
      const { data } = await this.client[methodName](this.preparaParams(params))
      return data
    } catch (e) {
      throw new MapApiError(e)
    }
  }
}

module.exports = BaseApi

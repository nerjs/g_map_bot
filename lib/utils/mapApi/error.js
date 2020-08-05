class MapApiError extends Error {
  constructor(e) {
    const { message, response } = e
    const { status, statusText, data } = response || {}
    const { error_message, ...respData } = data || {}

    super(error_message || message || statusText)

    this.name = 'MapApiError'

    this.statusCode = status
    this.statusText = statusText
    this.errorMessage = error_message

    Object.keys(respData).forEach(key => {
      this[key] = respData[key]
    })
  }
}

module.exports = MapApiError

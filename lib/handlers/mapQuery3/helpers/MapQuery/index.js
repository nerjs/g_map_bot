const Request = require('./Request')
const Response = require('./Response')
const { tap, optional } = require('../../../../utils/helpers')

class MapQuery {
  constructor() {
    this.request = null
    this.response = null
    this.error = null
  }

  setRequest(props) {
    this.request = new Request(props)
  }

  setResponse(props) {
    this.response = new Response(props)
  }

  setError(text) {
    this.error = text
  }

  get correctRequest() {
    return !this.error && this.request && this.request.correct
  }

  get correctResponse() {
    return !this.error && this.response && this.response.correct
  }

  static setMapQuery() {
    return tap(ctx => {
      ctx.mapQuery = new MapQuery(ctx)
    })
  }

  static optionalRequest(...fns) {
    return optional(ctx => ctx.mapQuery && ctx.mapQuery.correctRequest, ...fns)
  }

  static optionalResponse(...fns) {
    return optional(ctx => ctx.mapQuery && ctx.mapQuery.correctResponse, ...fns)
  }

  static optionalError(...fns) {
    return optional(ctx => ctx.mapQuery && ctx.mapQuery.error, ...fns)
  }
}

module.exports = MapQuery

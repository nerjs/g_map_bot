const Request = require('./Request')
const Response = require('./Response')
const { tap, optional } = require('../../../../utils/helpers')

class MapQuery {
  constructor() {
    this.request = null
    this.response = null
  }

  setRequest(props) {
    this.request = new Request(props)
  }

  setResponse(props) {
    this.response = new Response(props)
  }

  get correctRequest() {
    return this.request && this.request.correct
  }

  get correctResponse() {
    return this.response && this.response.correct
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
}

module.exports = MapQuery

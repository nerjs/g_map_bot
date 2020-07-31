const QueryParser = require('../QueryParser')
const { BotError } = require('../error')
const { INCORRECT_CONTRUCTOR_ARG, UNKNOWN_ERROR } = require('../../messages/errors')
const { getId } = require('../str')

class QueryResult {
  constructor(query) {
    if (!(query instanceof QueryParser)) throw new BotError(INCORRECT_CONTRUCTOR_ARG, UNKNOWN_ERROR, { query })
    this.query = query

    this.id = getId()
  }

  get hasResult() {
    return true
  }

  get settings() {
    return {
      reaction: true,
      link: true,
      share: true,
    }
  }

  get url() {
    if (this.query.url) return this.query.url.url
    return 'https://www.google.com.ua/maps/'
  }

  get lat() {
    if (this.query.url) return this.query.url.lat
    return 0
  }

  get lng() {
    if (this.query.url) return this.query.url.lng
    return 0
  }

  get title() {
    if (this.query.url) return `url: ${this.query.url.maptype}`
    if (this.query.search) return `search: ${this.query.search}`
    if (this.query.id) return `ID${this.query.type ? ` (${this.query.type})` : ''}: ${this.query.id}`
    return 'none'
  }

  get titles() {
    return this.query.search ? ['Search string 1', `Serch string 2. ${this.query.search}`] : []
  }

  get img() {
    if (this.query.search || this.query.id) return null
    return {
      width: 1024,
      height: 800,
      link: 'https://lorempixel.com/1024/800/city/',
    }
  }

  get thumb() {
    if (this.query.search) return null
    return {
      width: 400,
      height: 300,
      link: 'https://lorempixel.com/400/300/city/',
    }
  }

  async init() {}

  static async result(query) {
    const result = new QueryResult(query)
    await result.init()
    return result
  }
}

module.exports = QueryResult

const util = require('util')
const logger = require('nlogs')(module)
const { getClient } = require('../utils/redis')
const { REDIS_DBS, TTL } = require('../constants')

class ApiCache {
  constructor(prefix, json = true) {
    this.prefix = prefix
    this.json = json
    this.client = ApiCache.client
  }

  async get(key) {
    const data = await this.client.get(`${this.prefix}::${key}`)

    if (!this.json) return data

    try {
      return JSON.parse(data)
    } catch (e) {
      logger.warn(e)
      return null
    }
  }

  async set(key, data) {
    try {
      await this.client.set(`${this.prefix}::${key}`, this.json ? JSON.stringify(data) : data)
      await this.client.expire(`${this.prefix}::${key}`, TTL.SEARCH_CACHE)
    } catch (e) {
      logger.warn(e)
    }
  }

  static client = getClient(REDIS_DBS.MAP_CACHE)
}

module.exports = ApiCache

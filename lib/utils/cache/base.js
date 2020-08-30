const util = require('util')
const { Context } = require('telegraf')
const { getClient } = require('../redis')
const { getId } = require('../str')
const { REDIS_DBS, TTL } = require('../../constants')

class BaseCache {
  constructor(db, ttl, sessionIdField, prepareJson = true) {
    this.db = db || REDIS_DBS.DEFAULT
    this.ttl = ttl || TTL.DEFAULT
    this.client = null
    this.prepareJson = prepareJson

    this.sessionIdField = sessionIdField || `cache:${getId()}`
  }

  async getClient() {
    if (this.client) return this.client
    this.client = getClient(this.db)
    // this.client.get = util.promisify(this.client.get.bind(this.client))
    // this.client.set = util.promisify(this.client.set.bind(this.client))
    // this.client.mget = util.promisify(this.client.mget.bind(this.client))
    // this.client.mset = util.promisify(this.client.mset.bind(this.client))
    // this.client.del = util.promisify(this.client.del.bind(this.client))
    // this.client.expire = util.promisify(this.client.expire.bind(this.client))

    return this.client
  }

  getId(ctx, create) {
    if (ctx && ctx instanceof Context) {
      if (!ctx.session) return null
      if (create) ctx.session[this.sessionIdField] = ctx.session[this.sessionIdField] || getId()
      return ctx.session[this.sessionIdField] || null
    }

    return ctx || null
  }

  async get(ctx) {
    const id = this.getId(ctx)
    if (!id) return null
    const client = await this.getClient()
    try {
      const str = await client.get(id)

      return this.prepareJson ? JSON.parse(str) : str
    } catch (e) {
      return null
    }
  }

  async set(ctx, obj = {}) {
    const id = this.getId(ctx, true)
    if (!obj || (this.prepareJson && typeof obj !== 'object')) return null
    const client = await this.getClient()

    await client.set(id, this.prepareJson ? JSON.stringify(obj) : obj)
    await client.expire(id, this.ttl)

    return id
  }

  async remove(ctx) {
    const id = this.getId(ctx)
    if (!id) return null
    const client = await this.getClient()
    return client.del(id)
  }

  async setConsist(ctx, obj = {}) {
    if (!this.prepareJson) throw new Error('Cannot be done with property prepareJson equal to true')
    const id = this.getId(ctx, true)
    const consistId = getId()
    const fieldName = `${this.sessionIdField}:consist`
    const value = { ...(obj || {}), [fieldName]: consistId }

    await this.set(id, value)

    return async () => {
      const cached = await this.get(id)
      return (cached || {})[fieldName] === consistId
    }
  }
}

module.exports = BaseCache

const BaseCache = require('./base')
const { getId } = require('../str')

class ShortIds extends BaseCache {
  constructor(db, ttl) {
    super(db, ttl, null, false)
  }

  async getShort(original) {
    const originalId = `original:${original}`

    const short = await this.get(originalId)

    if (short) return short
    const shortId = getId()
    await Promise.all([this.set(`short:${shortId}`, original), this.set(originalId, shortId)])

    return shortId
  }

  async getOriginal(short) {
    return this.get(`short:${short}`)
  }
}

module.exports = ShortIds

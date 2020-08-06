const { resultCache } = require('../../../../utils/cache')
const { getId } = require('../../../../utils/str')

class ResultBase {
  constructor(props = {}) {
    this.id = null

    this.lat = null
    this.lng = null

    this.title = null

    this.url = null
    this.large = null
    this.thumb = null

    this.subType = 'result'

    Object.keys(this).forEach(key => {
      if (props[key]) {
        this[key] = props[key]
      }
    })
  }

  get ready() {
    return !!(this.hasCoordinates && this.hasLarge && this.hasThumb && this.title)
  }

  get hasCoordinates() {
    return !isNaN(Number(this.lat)) && !isNaN(Number(this.lng))
  }

  get hasLarge() {
    return !!this.large && this.large.width > 0 && this.large.height > 0 && this.large.link
  }
  get hasThumb() {
    return !!this.thumb && this.thumb.width > 0 && this.thumb.height > 0 && this.thumb.link
  }
}

class Result extends ResultBase {
  constructor(ctx) {
    super()

    this.ctx = ctx
    this.apiProps = { lang: (ctx && ctx.from && ctx.from.language_code) || 'en' }
    this.cache = resultCache
  }

  async load() {}

  async loadVariants() {}

  async variants(count = 4) {
    const loadedVariants = await this.loadVariants(count)
    console.log(loadedVariants)
    return (loadedVariants || []).map(variant => new ResultBase(variant)).filter(variant => variant.ready && variant.id)
  }

  async saveCache() {
    this.id = await this.cache.set(this.ctx, this.toObject())
    this.savedId = `cache_${this.subType ? `${this.subType}_` : ''}${this.id}`
  }

  async saveDraft() {
    this.savedId = `id:draft:${this.id || getId()}`
    await this.cache.set(this.savedId, this.toObject())
  }

  async saveQueue() {
    this.savedId = `id:queue:${this.id || getId()}`
    await this.cache.set(this.savedId, this.toObject())
  }

  toJSON() {
    return Result.toObject(this)
  }

  toObject() {
    return Result.toObject(this)
  }

  static toObject(that = {}) {
    const { ctx, apiProps, cache, ...obj } = that
    return obj
  }
}

module.exports = Result

const { isUrl, isId, getIdFromStr, isSearch, getCacheId } = require('../str')
const UrlParser = require('../UrlParser')
const { inlineCache } = require('../cache')

class QueryParser {
  constructor(str) {
    this.str = str
  }

  get hasResult() {
    return !!(this.search || this.id || (this.url && this.url.success))
  }

  async parse() {
    const cacheId = getCacheId(this.str)
    if (cacheId) {
      const cached = await inlineCache.get(cacheId)
      this.cached = true
      if (cached.search) this.search = cached.search
      if (cached.id) {
        this.id = cached.id
        this.type = cached.type || 'draft'
      }
      if (cached.url) this.url = new UrlParser(cached.url)
    } else if (isId(this.str)) {
      const { id, type } = getIdFromStr(this.str)
      this.id = id
      this.type = type
    } else if (isUrl(this.str)) {
      this.url = new UrlParser(this.str)
    } else if (isSearch(this.str)) {
      this.search = this.str
    }
  }

  static async parse(str) {
    const query = new QueryParser(str)
    await query.parse()
    return query
  }
}

module.exports = QueryParser

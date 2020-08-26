const crypto = require('crypto')
const BaseCache = require('./base')

class ShortIds extends BaseCache {
  async add(urlParser) {
    if (!urlParser || !urlParser.errors) return
    await this.set(
      crypto
        .createHash('sha256')
        .update(urlParser.url)
        .digest('hex'),
      { url: urlParser.url, errors: urlParser.errors },
    )
  }
}

module.exports = ShortIds

const { TYPES } = require('./schema')

class OptionsDb {
  static parseKind(value) {
    return value instanceof Date
      ? TYPES.DATE
      : typeof value === 'number'
      ? TYPES.NUMBER
      : typeof value === 'boolean'
      ? TYPES.BOOL
      : typeof value === 'string'
      ? TYPES.STRING
      : TYPES.JSON
  }

  static async get(name) {
    const doc = await this.findOne({ name })
    return (doc && doc[doc.kind]) || null
  }

  static async set(name, value) {
    const kind = OptionsDb.parseKind(value)

    let doc = await this.findOne({ name })

    if (doc && doc.kind !== kind) {
      throw new Error(`Wrong option kind. [kind: ${kind}, prevKind: ${doc.kind}]`)
    } else if (!doc) {
      doc = new this({ name, kind })
    }

    doc[kind] = value
    await doc.save()
  }

  static async delete(name) {
    if (await this.exists({ name })) {
      await this.deleteOne({ name })
      return true
    }
    return false
  }

  static async size() {
    return this.estimatedDocumentCount()
  }
}

module.exports = OptionsDb

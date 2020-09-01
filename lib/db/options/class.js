const { TYPES } = require('./schema')

class OptionsDb {
  // get name() {
  //   return this._id
  // }

  // set name(val) {
  //   this._id = val
  // }

  get value() {
    return this[this.kind]
  }

  set value(val) {
    const kind = OptionsDb.parseKind(val)
    this.kind = kind
    this[kind] = val

    console.log(this)
  }

  static parseKind(value) {
    return value instanceof Date
      ? TYPES.DATE
      : typeof value === 'number'
      ? TYPES.NUMBER
      : typeof value === 'boolean'
      ? TYPES.BOOL
      : TYPES.STRING
  }

  static async get(name) {
    const doc = await this.findOne({ name })
    return (doc && doc[doc.kind]) || null
  }

  static async set(name, value) {
    const kind = OptionsDb.parseKind(value)
    if (await this.exists({ name })) {
      await this.deleteOne({ name })
    }

    const doc = new this({ name, kind, [kind]: value })
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

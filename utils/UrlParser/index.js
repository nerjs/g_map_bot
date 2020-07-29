const { FIELDS, ENUMS, PREPARES, PARSERS } = require('./schemes')
const { MAPTYPES, URL_REGEXP, ERROR_TYPES } = require('./constants')

class GMapUrlParser {
  constructor(url) {
    this.url = url

    this.positions = {}

    this.parse()
  }

  get success() {
    return this.hasOwnProperty('lat') && !isNaN(this.lat) && this.hasOwnProperty('lng') && !isNaN(this.lng)
  }

  get errors() {
    if (!this._errors || !this._errors.length) return null
    const resErrors = []

    this._errors.forEach(({ type, details }) => {
      if (details.key) {
        const { key, ...error } = details
        let idx = resErrors.findIndex(re => re.key === key)
        if (idx < 0) {
          idx = resErrors.length
          resErrors.push({ key })
        }

        const err = resErrors[idx]
        if (!err.errors) err.errors = {}
        if (!err.errors[type]) err.errors[type] = []
        err.errors[type].push(error)
      } else {
        resErrors.push({ type, details })
      }
    })

    return resErrors
  }

  setError(type, details) {
    if (!this._errors) this._errors = []
    this._errors.push({ type, details })
  }

  parse() {
    const matched = this.url.match(URL_REGEXP)
    if (!matched || !matched.groups || !matched.groups.position) return null

    const { position, data, queryType, query } = matched.groups

    const [lat, lng, ...arr] = position.split(',')

    arr.forEach(s => {
      const m = s.match(/^(?<num>[0-9\.]+)(?<type>[a-z]{1,1})$/)
      if (m && m.groups && m.groups.type && m.groups.num && !isNaN(Number(m.groups.num))) {
        this.positions[m.groups.type] = Number(m.groups.num)
        if (m.groups.type === 'z') {
          this.zoom = Number(m.groups.num)
        }
        if (m.groups.type === 'm') {
          this.meters = Number(m.groups.num)
        }
      }
    })

    this.data = data
    const { map, content, layers, ...remaindData } = this.parseData(data)

    if (map) {
      this.map = map

      if (this.map.type) {
        this.maptype = MAPTYPES[this.map.type]
      }
    }

    if (!this.maptype) this.maptype = MAPTYPES[0]

    if (content) this.content = content
    if (layers) this.layers = layers

    if (remaindData && Object.keys(remaindData).length) this.setError(ERROR_TYPES.REMAIND, remaindData)

    if (queryType) {
      this.queryType = queryType
      this.query = query
      this[queryType] = query
    }
    this.lat = Number(lat)
    this.lng = Number(lng)
  }

  parseData(data) {
    if (!data || !data.length) return this.parseData('3m1!1e0')

    const arr = data
      .split('!')
      .filter(s => !!s)
      .map(s => ({ key: `${s[0]}${s[1]}`, type: s[1], val: s.substr(2) }))

    if (!arr.length) return {}
    if (arr[0].type !== 'm') throw new Error(`Row must started with m type. [startType: ${arr[0].type}, row: ${arr}]`)

    return this.parseFields(this.decodeFields(arr, {}), [])
  }

  decodeFields(arr, obj) {
    if (!arr.length) return obj
    const { key, type, val } = arr.shift()

    if (type === 'm') {
      const length = Number(val)
      if (isNaN(length) || arr.length < length)
        throw new Error(`Bad structure. [key: ${key}, length: ${length}, arr: ${arr}]`)

      const fieldsArr = arr.splice(0, length)
      obj[key] = {}
      this.decodeFields(fieldsArr, obj[key])
    } else {
      obj[key] = PARSERS[type] ? PARSERS[type](val) : val
    }

    if (arr.length) this.decodeFields(arr, obj)

    return obj
  }

  parseFields(obj, parents) {
    const res = {}

    Object.keys(obj).forEach(key => {
      const type = key[1]
      const fieldName = this.getFieldName(key, parents, obj[key])
      let value

      if (type === 'e') {
        value = Number(obj[key])
        res[fieldName] = value
        const enumStr = this.getEnumStr(key, parents, value)
        if (enumStr) res[`${fieldName}Str`] = enumStr
        if (key === '2e') {
          console.log({ res, fieldName, enumStr })
          // process.exit()
        }
        return res
      } else if (type === 'm') {
        value = this.parseFields(obj[key], [...parents, key])
      } else {
        value = this.prepareValue(key, parents, obj[key])
      }

      if (fieldName) res[fieldName] = value
    })
    return res
  }

  getFieldName(field, parents = [], val) {
    const key = [...parents, field].join('.')
    if (FIELDS[key]) return FIELDS[key]
    this.setError(ERROR_TYPES.FIELDNAME, { field, key, val })
    return field
  }

  getEnumStr(field, parents = [], val) {
    const key = [...parents, field].join('.')
    const enumKey = ENUMS[key]

    if (enumKey && enumKey[val]) return enumKey[val]

    this.setError(ERROR_TYPES.ENUMSTR, { field, key, val, enumKey })

    return null
  }

  prepareValue(field, parents = [], value) {
    const key = PREPARES[[...parents, field].join('.')]
    return key ? key(value) : value
  }
}

module.exports = GMapUrlParser

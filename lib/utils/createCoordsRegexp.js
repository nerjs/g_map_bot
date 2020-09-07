const { COORDINATES_FORMAT } = require('../constants')
const { isString } = require('./str')
const { coordsFormatSchema } = require('./validate')
const getMapType = require('./getMapType')

module.exports = onceSep => {
  const sep = onceSep ? '\\:' : '(\\:|,|\\s)'
  const latLng = '(\\-?[0-9]+\\.?([0-9]+)?)'
  const zoom = '([0-9]{1,2}(\\.[0-9]{1,2)?})'
  const types = `(${Object.values(COORDINATES_FORMAT.TYPES).join('|')})`
  const notExists = `(${Object.values(COORDINATES_FORMAT.NOT_EXISTS_TYPES).join('|')})`

  const rgx = new RegExp(
    `^((?<type>${types})${sep})?((?<notExists>${notExists})${sep})?(?<lat>${latLng})${sep}(?<lng>${latLng})(${sep}(?<zoom>${zoom}))?$`,
  )

  return {
    test(str) {
      return isString() ? rgx.test(`${str}`) : false
    },
    match(str) {
      if (!isString(str) || !str.length) return null
      const matched = str.match(rgx)

      if (!matched || !matched.groups) return null

      const res = {
        type: matched.groups.type || COORDINATES_FORMAT.TYPES.MAP,
        notExists: matched.groups.notExists || COORDINATES_FORMAT.NOT_EXISTS_TYPES.MAP,
        lat: Number(matched.groups.lat),
        lng: Number(matched.groups.lng),
        zoom: matched.groups.zoom && Number(matched.groups.zoom),
      }

      res.maptype = getMapType(res.type !== COORDINATES_FORMAT.TYPES.PHOTO ? res.type : res.notExists)

      return coordsFormatSchema.isValidSync(res) ? res : null
    },
  }
}

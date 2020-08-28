const Request = require('../helpers/MapQuery/Request')
const { incorrectCoordsFormat } = require('../messages')
const { DEFAULT_ZOOM } = require('../../../constants')

const coordsRegExp = new RegExp(
  `^((?<subtype>(${Object.values(Request.SUBTYPES[Request.TYPES.COORDS]).join('|')}))(:|\\s))?((?<defType>(${[
    Request.SUBTYPES[Request.TYPES.COORDS].MAP,
    Request.SUBTYPES[Request.TYPES.COORDS].SATELLITE,
  ].join('|')}))(:|\\s))?(?<lat>[0-9\\.]+)(:|\\s)(?<lng>[0-9\\.]+)((:|\\s)(?<zoom>[0-9]{1,2}))?$`,
)

module.exports = async ctx => {
  if (!ctx.queryCommandSubtext) return ctx.mapQuery.setError(incorrectCoordsFormat)
  const matched = ctx.queryCommandSubtext.match(coordsRegExp)

  if (
    !matched ||
    !matched.groups ||
    !matched.groups.lat ||
    !matched.groups.lng ||
    isNaN(Number(matched.groups.lat)) ||
    isNaN(Number(matched.groups.lng))
  )
    return ctx.mapQuery.setError(incorrectCoordsFormat)

  const { subtype, defType, lat, lng } = matched.groups
  const zoom = Number(matched.groups.zoom)

  ctx.mapQuery.setRequest({
    type: Request.TYPES.COORDS,
    subtype: (subtype || Request.SUBTYPES[Request.TYPES.COORDS].MAP).toUpperCase(),
    defType: (defType || Request.SUBTYPES[Request.TYPES.COORDS].MAP).toUpperCase(),
    lat: Number(lat),
    lng: Number(lng),
    zoom: zoom && zoom > 0 && zoom <= 21 ? zoom : DEFAULT_ZOOM,
  })
}

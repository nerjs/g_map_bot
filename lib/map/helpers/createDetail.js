const { Place } = require('../../db')
const StaticApi = require('../api/StaticApi')

module.exports = async ({ lat, lng, zoom, maptype, lang, defaultZoom }) => {
  const placeId = `place_${lat}:${lng}`
  let doc = await Place.findOne({ placeId })

  if (doc) return doc

  const staticApi = new StaticApi({ lang })

  doc = new Place({
    placeId,
    lang,
    title: 'Coordinates',
    url: staticApi.mapUrl({ lat, lng, zoom: zoom || defaultZoom, maptype }),
    location: { lat, lng },
  })

  await doc.save()

  return doc
}

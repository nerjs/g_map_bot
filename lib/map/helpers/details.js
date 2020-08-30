const logger = require('nlogs')(module)
const Batchloader = require('@nerjs/batchloader')
const PlaceApi = require('../api/PlaceApi')
const { Place } = require('../../db')
const StaticApi = require('../api/StaticApi')

const detailsLoader = new Batchloader(
  async pls => {
    const lang = pls[0].lang
    const placeApi = new PlaceApi({ lang })

    const placeDocs = await Place.find({ placeId: { $in: pls.map(pl => pl.place_id) }, lang })

    return Promise.all(
      pls.map(async ({ place_id: placeId, structured_formatting = {}, description }) => {
        const doc = placeDocs.find(pld => pld.placeId === placeId)
        if (doc) return doc

        const { geometry, url, photos } = (await placeApi.loadDetails(placeId, ['geometry', 'photo', 'url'])) || {}

        if (!geometry || !geometry.location) {
          logger.warn('Incorrect place details', { placeId, geometry })
          return null
        }

        const place = new Place({
          placeId,
          lang,
          location: geometry.location,
          viewport: geometry.viewport || null,
          title: structured_formatting.main_text || structured_formatting.secondary_text || description,
          description: structured_formatting.main_text ? structured_formatting.secondary_text || description : null,
          url,
          photos: (photos || []).map(({ photo_reference, width, height }) => {
            const staticApi = StaticApi.createMaxSize({ lang }, { width, height })

            return {
              originalId: photo_reference,
              large: staticApi.placePhotoLarge(photo_reference),
              thumb: staticApi.placePhotoThumb(photo_reference),
            }
          }),
        })

        await place.save()

        return place
      }),
    )
  },
  {
    maxSize: 50,
    batchTime: 10,
    cacheTime: 100,
    getKey: pl => `${pl.place_id}_${pl.lang}`,
  },
)

module.exports = async (pl, lang = 'en') => {
  if (!pl || typeof pl !== 'object' || !pl.place_id || !lang) return null
  return detailsLoader.load({ ...pl, lang })
}

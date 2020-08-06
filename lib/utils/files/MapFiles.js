const Files = require('./Files')
const MapApi = require('../mapApi')
const { IMG, THUMB } = require('./constants')

class MapFiles extends Files {
  constructor(api) {
    super()
    this.api = api || new MapApi({ lang: 'en' })
    this.host = process.env.FILES_HOST
  }

  normalizeSize(current, max = 5000, min = 0) {
    const num = Number(current)
    if (!isNaN(num) && num >= min && num <= max) return num
    return max
  }

  async placePhoto(id, { reference, maxwidth, maxheight }) {
    const saved = await this.get(id)

    if (saved) {
      if (saved.path) {
        saved.url = `${this.host}${saved.path}`
      }

      return saved
    }

    const data = await this.api.placePhoto({ photoreference: reference, maxwidth, maxheight })

    const placePhoto = await this.set(id, { data })
    return { ...placePhoto, url: `${this.host}${placePhoto.path}` }
  }

  async placeImages(photoId, reference) {
    const [img, thumb] = await Promise.all([
      this.placePhoto(`i:p:${photoId}`, { reference, maxwidth: IMG.WIDTH, maxheight: IMG.HEIGHT }),
      this.placePhoto(`t:p:${photoId}`, { reference, maxwidth: THUMB.WIDTH, maxheight: THUMB.HEIGHT }),
    ])
    return {
      img,
      thumb,
    }
  }
}

module.exports = MapFiles

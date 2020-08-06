const StaticApi = require('../StaticApi')

class PlacePhoto {
  constructor(photo, props) {
    this.prepare(photo, props)
  }

  prepare({ large, thumb, photo_reference, width, height }, props) {
    if (large && !thumb) return this.prepare({ ...large, photo_reference })

    if (!photo_reference) throw new Error('Missing photo_reference')
    this.photo_reference = photo_reference

    if (large && thumb) {
      this.large = large
      this.thumb = thumb
      return
    }

    const staticApi = StaticApi.createMaxSize(props, { width, height })

    this.large = staticApi.placePhotoLarge(photo_reference)
    this.thumb = staticApi.placePhotoThumb(photo_reference)
  }
}

module.exports = PlacePhoto

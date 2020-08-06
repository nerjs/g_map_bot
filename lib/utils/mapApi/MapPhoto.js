const StaticApi = require('./StaticApi')

class MapPhoto {
  constructor(mapData, props) {
    this.prepare(mapData, props)
  }

  prepare({ large, thumb, ...mapData }, props) {
    if (large && thumb) {
      this.large = large
      this.thumb = thumb
      return
    }

    const staticApi = new StaticApi(props)

    this.large = staticApi.mapImgLarge(mapData)
    this.thumb = staticApi.mapImgThumb(mapData)
  }
}

module.exports = MapPhoto

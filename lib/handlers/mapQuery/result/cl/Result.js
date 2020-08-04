class Result {
  constructor() {
    this.lat = null
    this.lng = null
    this.mapType = null
    this.zoom = null
    this.img = null
    this.imgWidth = 0
    this.imgHeight = 0
    this.thumb = null
    this.thumbWidth = 0
    this.thumbHeight = 0

    this.titles = []
  }

  get title() {
    return this.titles[0]
  }

  get hasCoordinates() {
    return !isNaN(Number(this.lat)) && !isNaN(Number(this.lng)) && !isNaN(Number(this.zoom))
  }

  get ready() {
    return this.hasCoordinates && this.hasImg && this.hasThumb && this.mapType
  }

  get hasImg() {
    return !!this.img && this.imgWidth > 0 && this.imgHeight > 0
  }
  get hasThumb() {
    return !!this.thumb && this.thumbWidth > 0 && this.thumbHeight > 0
  }

  async load() {}
}

module.exports = Result

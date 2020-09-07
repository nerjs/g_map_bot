const qs = require('qs')
const { LARGE, THUMB } = require('./constants')
const BaseApi = require('./BaseApi')
const { DEFAULT_ZOOM } = require('../../constants')

class StaticApi extends BaseApi {
  constructor({ sizes, zoom, ...props }, baseParams = {}) {
    super({ ...props, ...baseParams })

    this.sizes = {}
    const largeSizes = (sizes && sizes.large) || {}
    this.sizes.large = {
      width: largeSizes.width || LARGE.WIDTH,
      height: largeSizes.height || LARGE.HEIGHT,
    }
    const thumbSizes = (sizes && sizes.thumb) || {}
    this.sizes.thumb = {
      width: thumbSizes.width || THUMB.WIDTH,
      height: thumbSizes.height || THUMB.HEIGHT,
    }

    this.defaultZoom = zoom || DEFAULT_ZOOM
  }

  placePhotoLink(photoreference, maxwidth, maxheight) {
    return `${this.url}place/photo?${qs.stringify({
      key: this.key,
      photoreference,
      maxwidth,
      maxheight,
    })}`
  }

  mapImgLink({ lat, lng, width, height, ...params }) {
    return `${this.url}staticmap?${qs.stringify({
      key: this.key,
      center: `${lat},${lng}`,
      size: `${width}x${height}`,
      language: this.lang,
      ...params,
    })}`
  }

  mapImg({ width, height, zoom, viewport, maptype, ...params }) {
    const { scale, mapWidth, mapHeight, ...sizes } = this.relationMapSizes(width, height)
    return {
      width: sizes.width,
      height: sizes.height,
      link: this.mapImgLink({
        maptype: maptype || 'roadmap',
        width: mapWidth,
        height: mapHeight,
        scale,
        zoom:
          zoom ||
          (viewport &&
            this.zoomFromViewport(viewport.northeast || viewport.ne, viewport.southwest || viewport.sw, mapWidth)) ||
          this.defaultZoom,
        ...params,
      }),
    }
  }

  mapUrl({ lat, lng, zoom, maptype }) {
    return `https://www.google.com/maps/@?${qs.stringify({
      api: 1,
      map_action: 'map',
      center: `${lat},${lng}`,
      zoom,
      basemap: `${maptype}`.toLowerCase(),
    })}`
  }

  placePhotoLarge(photoreference) {
    const { width, height } = this.sizes.large
    return {
      width,
      height,
      link: this.placePhotoLink(photoreference, width, height),
    }
  }

  placePhotoThumb(photoreference) {
    const { width, height } = this.sizes.thumb
    return {
      width,
      height,
      link: this.placePhotoLink(photoreference, width, height),
    }
  }

  mapImgLarge(params = {}) {
    return this.mapImg({ ...params, ...this.sizes.large })
  }

  mapImgThumb(params = {}) {
    return this.mapImg({ ...params, ...this.sizes.thumb })
  }

  prepareSizes(current, original) {
    if (!original) return current
    return this.relationPhotoSizes()
  }

  relationPhotoSizes(...params) {
    return StaticApi.relationPhotoSizes(...params)
  }

  relationMapSizes(...params) {
    return StaticApi.relationMapSizes(...params)
  }

  zoomFromViewport(...params) {
    return StaticApi.zoomFromViewport(...params)
  }

  static scales = {
    SCALE_1: 640,
    SCALE_2: 1280,
  }

  static sizes = { large: LARGE, thumb: THUMB }

  static relationPhotoSizes(w1, h1, w2, h2) {
    let res = []

    if (w1 === h1) {
      res = [w2, w2]
    } else if (w1 > h1) {
      res = [w2, h2 * (h1 / w1)]
    } else if (w1 < h1) {
      res = [w2 * (w1 / h1), h2]
    }

    return {
      width: parseInt(res[0]),
      height: parseInt(res[1]),
    }
  }

  static relationMapSizes(width, height) {
    const { SCALE_1, SCALE_2 } = this.scales
    if (width > SCALE_2 || height > SCALE_2) {
      const newSizes = StaticApi.relationPhotoSizes(width, height, SCALE_2, SCALE_2)
      return StaticApi.relationMapSizes(newSizes.width, newSizes.height)
    }

    const scale = width > SCALE_1 || height > SCALE_1 ? 2 : 1

    const { mapWidth, mapHeight } = (() => {
      if (scale === 1) return { mapWidth: width, mapHeight: height }
      const mapScaledSize = StaticApi.relationPhotoSizes(width, height, SCALE_1, SCALE_1)

      return { mapWidth: mapScaledSize.width, mapHeight: mapScaledSize.height }
    })()

    return { width, height, scale, mapWidth, mapHeight }
  }

  static zoomFromViewport(ne, sw, width) {
    if (!ne || !ne.lat || !ne.lng || !sw || !sw.lat || !sw.lng) throw new Error('Incorrect args')
    const GLOBE_WIDTH = 256 // a constant in Google's map projection
    const west = sw.lng
    const east = ne.lng
    let angle = east - west
    if (angle < 0) {
      angle += 360
    }
    return Math.round(Math.log((width * 360) / angle / GLOBE_WIDTH) / Math.LN2)
  }

  static createMaxSize(props, { width, height }) {
    const large = this.relationPhotoSizes(width, height, LARGE.WIDTH, LARGE.HEIGHT)
    const thumb = this.relationPhotoSizes(width, height, THUMB.WIDTH, THUMB.HEIGHT)

    return new StaticApi({ sizes: { large, thumb }, ...props })
  }
}

module.exports = StaticApi

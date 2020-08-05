const MapApiError = require('./error')

const { GOOGLE_MAPS_API_KEY } = process.env

exports.wp = (params = {}) => ({ params: { ...params, key: GOOGLE_MAPS_API_KEY } })

exports.wrap = async fn => {
  try {
    const { data } = await fn()
    return data
  } catch (e) {
    throw new MapApiError(e)
  }
}

exports.relationCoords = (w1, h1, w2, h2) => {
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

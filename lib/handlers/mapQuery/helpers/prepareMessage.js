const { prepareMarkdownMsg } = require('../../../utils/str')
const { MAP_TYPES } = require('../../../constants')

const prepareText = place => {
  let msg = `*${prepareMarkdownMsg(place.title)}*`

  if (place.description) {
    msg += `\n${prepareMarkdownMsg(place.description)}`
  }

  msg += `\n_${prepareMarkdownMsg(`${place.location.lat} : ${place.location.lng}`)}_`

  msg += `\n[Show \\.\\.\\.](${place.url})`

  return msg
}

const preparePhoto = (corePhoto, reservePhoto) => {
  const photo = corePhoto || reservePhoto

  if (!photo || !photo.large || !photo.thumb) return {}

  return {
    photo,
    large: { ...photo.large, link: photo.large.tgId || photo.large.link },
    thumb: { ...photo.thumb, link: photo.thumb.tgId || photo.thumb.link },
  }
}

module.exports = { prepareText, preparePhoto }

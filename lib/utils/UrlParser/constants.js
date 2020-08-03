exports.URL_REGEXP = /^https?:\/\/(www\.)?google(.*)\/maps\/((?<queryType>(place|dir|search))\/(?<query>.*)\/)?@(?<position>[0-9\.\,a-z]+)(\/data=(?<data>(.*)))?/

exports.MAPTYPES = {
  MAP: 0,
  STREET_VIEW: 1,
  PHOTO: 2,
  SATELLITE: 3,
  0: 'MAP',
  1: 'STREET_VIEW',
  2: 'PHOTO',
  3: 'SATELLITE',
}

exports.ERROR_TYPES = {
  REMAIND: 'REMAIND',
  FIELDNAME: 'FIELDNAME',
  ENUMSTR: 'ENUMSTR',
}

exports.DEFAULT_ZOOM = 10
exports.DEFAULT_METERS = 10000

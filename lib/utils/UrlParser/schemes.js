const moment = require('moment')
const { MAPTYPES } = require('./constants')

exports.PARSERS = {
  e: parseInt,
  s: s => `${s}`,
  i: Number,
  d: parseFloat,
  j: Date,
  b: v => !!(v && Number(v)),
}

exports.FIELDS = {
  '3m': 'map',
  '3m.1e': 'type',
  '3m.3m': 'img',
  '3m.4b': 'sidebar',

  '3m.3m.1s': 'id',
  '3m.3m.5s': 'time',
  '3m.3m.6s': 'thumb',
  '3m.3m.7i': 'width',
  '3m.3m.8i': 'height',
  '3m.3m.2e': 'author',

  '4m': 'content',
  '4m.1m': 'checkSearchResult',
  '4m.1m.2m': 'search',
  '4m.1m.2m.6e': 'count',
  '4m.1m.2m.1z': 'id',
  '4m.2m': 'search',
  '4m.2m.6e': 'count',
  '4m.3m': 'object',
  '4m.3m.1s': 'id',
  '4m.3m.8m': 'coordinates',
  '4m.3m.8m.3d': 'lat',
  '4m.3m.8m.4d': 'lng',

  '5m': 'layers',
}

exports.ENUMS = {
  '3m.1e': {
    [MAPTYPES.MAP]: 'Street Map',
    [MAPTYPES.STREET_VIEW]: 'Street View',
    [MAPTYPES.PHOTO]: 'User Photos',
    [MAPTYPES.SATELLITE]: 'Satellite',
  },
  '3m.3m.2e': {
    0: 'none',
    10: 'user',
  },
}

exports.PREPARES = {
  '3m.3m.6s': str => decodeURIComponent(str),
  '3m.3m.5s': str => moment(str).toDate(),
}

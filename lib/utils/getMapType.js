const { MAP_TYPES } = require('../constants')

module.exports = type => (type === 'map' ? MAP_TYPES.ROADMAP : MAP_TYPES[`${type}`.toUpperCase()] || MAP_TYPES.ROADMAP)

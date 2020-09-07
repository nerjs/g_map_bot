const { Composer } = require('telegraf')
const { search, coordinates } = require('./commands')
const text = require('./text')

const mapQuery = new Composer()

mapQuery.command('search', search)
mapQuery.command(['coords', 'coordinates'], coordinates)
mapQuery.on('text', text)

module.exports = mapQuery

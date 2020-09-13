const { Composer } = require('telegraf')
const { search, coordinates, replyHandler, url } = require('./commands')
const text = require('./text')
const { waitReplyCategory } = require('../../utils/helpers')

const mapQuery = new Composer()

mapQuery.command('search', search)
mapQuery.command(['coords', 'coordinates'], coordinates)
mapQuery.command('url', url)
mapQuery.on('text', waitReplyCategory(['search', 'coordinates', 'url'], replyHandler))
mapQuery.on('text', text)

module.exports = mapQuery

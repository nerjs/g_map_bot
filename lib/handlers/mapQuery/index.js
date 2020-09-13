const { Composer } = require('telegraf')
const { search, coordinates, replyHandler } = require('./commands')
const text = require('./text')
const { waitReplyCategory } = require('../../utils/helpers')

const mapQuery = new Composer()

mapQuery.command('search', search)
mapQuery.command(['coords', 'coordinates'], coordinates)
mapQuery.on('text', waitReplyCategory(['search', 'coordinates'], replyHandler))
mapQuery.on('text', text)

module.exports = mapQuery

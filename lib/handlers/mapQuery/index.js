const { Composer } = require('telegraf')
const { search } = require('./commands')
const text = require('./text')

const mapQuery = new Composer()

mapQuery.command('search', search)
mapQuery.on('text', text)

module.exports = mapQuery

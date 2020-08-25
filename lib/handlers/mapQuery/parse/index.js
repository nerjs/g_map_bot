const { Composer } = require('telegraf')
const random = require('./random')
const { tap } = require('../../../utils/helpers')
const coords = require('./coords')
const search = require('./search')
const url = require('./url')
const start = require('./start')
const inline = require('./inline')
const text = require('./text')
const { commandSubtype } = require('../../../utils/str')

const parse = new Composer()

parse.command(
  ['random', 'coordinates', 'coords', 'search', 'url'],
  tap(ctx => {
    ctx.queryCommandSubtext = commandSubtype(ctx.message.text, ctx.message.entities)
  }),
)

parse.command('random', random)
parse.command(['coordinates', 'coords'], coords)
parse.command('search', search)
parse.command('url', url)
parse.start(start)
parse.on('inline_query', inline)
parse.on('text', text)

module.exports = parse

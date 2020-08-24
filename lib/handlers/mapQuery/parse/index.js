const { Composer } = require('telegraf')
const random = require('./random')
const { tap } = require('../../../utils/helpers')

const parse = new Composer()

parse.command('random', random)

module.exports = parse

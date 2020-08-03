const { Composer } = require('telegraf')
const { NOT_RESULTS } = require('../../messages/short')

const empty = new Composer()

empty.on('text', Composer.reply(NOT_RESULTS))

empty.on('inline_query', ctx => ctx.answerInlineQuery([], {}))

module.exports = empty

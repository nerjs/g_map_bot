const { Composer } = require('telegraf')
const logger = require('nlogs')(module)
const markdown = require('./markdown')
const session = require('../utils/session')

// START MIDDLEWARES
const startMdw = new Composer()
startMdw.use(session)
startMdw.use(markdown)

// END MIDDLEWARES
const endMdw = new Composer()

endMdw.on('inline_query', ctx => ctx.answerInlineQuery([], { switch_pm_parameter: '_', switch_pm_text: 'Empty' }))
endMdw.on('callback_query', ctx => ctx.answerCbQuery('Not supported yet!'))
endMdw.on('chosen_inline_result', ctx =>
  logger.debug('chosen_inline_result', ctx.chosenInlineResult.query, ctx.chosenInlineResult.result_id),
)

endMdw.on('message', ctx => ctx.reply('Даже не знаю что ответить...'))

exports.startMdw = startMdw
exports.endMdw = endMdw

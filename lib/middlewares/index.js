const { Composer } = require('telegraf')
const logger = require('nlogs')(module)
const markdown = require('./markdown')
const session = require('../utils/session')
const log = require('./log')

// START MIDDLEWARES
const startMdw = new Composer()
if (process.env.NODE_ENV !== 'production') startMdw.use(log('core'))
startMdw.use(session)
startMdw.use(markdown)

// END MIDDLEWARES
const endMdw = new Composer()

endMdw.on('inline_query', ctx => ctx.answerInlineQuery([], { switch_pm_parameter: '_', switch_pm_text: 'Empty' }))
endMdw.on('callback_query', ctx => ctx.answerCbQuery('Not supported yet!'))
endMdw.on('chosen_inline_result', ctx =>
  logger.debug('chosen_inline_result', ctx.chosenInlineResult.query, ctx.chosenInlineResult.result_id),
)

endMdw.on('message', ctx => ctx.reply('Даже не знаю что ответить...', { reply_to_message_id: ctx.message.message_id }))

exports.startMdw = startMdw
exports.endMdw = endMdw

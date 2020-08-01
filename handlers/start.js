const { START_MESSAGE } = require('../messages/start')
const parseQuery = require('./parseQuery')
const { UNDEFINED_ERROR } = require('../messages/short')

// startPayload
module.exports = async ctx => {
  if (ctx.startPayload) {
    const emptyReply = ctx => ctx.reply(UNDEFINED_ERROR)
    return parseQuery(ctx.startPayload, ctx, { emptyQuery: emptyReply, emptyResult: emptyReply })
  }
  await ctx.replyWithMarkdown(START_MESSAGE)
  await ctx.setMyCommands([
    {
      command: 'help',
      description: 'Help description',
    },
    {
      command: 'channels',
      description: 'Channels description',
    },
    {
      command: 'queue',
      description: 'Queue description',
    },
    {
      command: 'settings',
      description: 'Settings description',
    },
  ])
}

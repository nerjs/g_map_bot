const { START_MESSAGE } = require('../messages/start')

// startPayload
module.exports = async ctx => {
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

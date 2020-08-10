const { START_MESSAGE } = require('../messages/start')

// startPayload
module.exports = async ctx => {
  const commands = [
    {
      command: 'help',
      description: 'Help description',
    },
    {
      command: 'settings',
      description: 'Settings description',
    },
    {
      command: 'search',
      description: 'Search description',
    },
    {
      command: 'url',
      description: 'Url description',
    },
    {
      command: 'format',
      description: 'Format description',
    },
    {
      command: 'cache',
      description: 'Cache description',
    },
  ]

  await ctx.replyWithMarkdown(
    `${START_MESSAGE}\n*Bot commands\:*\n${commands
      .map(({ command, description }) => `• /${command} \\- _${description}_`)
      .join('\n')}`,
  )
  await ctx.setMyCommands(commands)
}

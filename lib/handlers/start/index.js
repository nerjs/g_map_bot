const message = require('./message')

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
      command: 'random',
      description: 'Random description',
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
      command: 'coordinates',
      description: 'Coordinates description',
    },
    {
      command: 'cache',
      description: 'Cache description',
    },
  ]

  await ctx.replyWithMarkdownV2(
    `${message}\n*Bot commands\:*\n${commands
      .map(({ command, description }) => `• /${command} \\- _${description}_`)
      .join('\n')}`,
  )
  await ctx.setMyCommands(commands)
}

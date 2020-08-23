const { Composer } = require('telegraf')
const { getNames } = require('./fields')
const { command, actions, editReply } = require('./actions')
const { waitReplyCategory } = require('../../utils/helpers')

const settings = new Composer()

settings.command('settings', command)
settings.action(new RegExp(`^settings(\:(?<fieldName>(${getNames().join('|')})))?(\:(?<position>[0-9]+))?$`), actions)

settings.use(waitReplyCategory('settings', editReply))

module.exports = settings

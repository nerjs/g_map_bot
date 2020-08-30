const { Composer } = require('telegraf')
const updateGroups = require('./groups')
const updateChannels = require('./channels')
const { tap } = require('../../utils/helpers')
const user = require('./user')

const updateChatInfo = new Composer()

updateChatInfo.use(Composer.chatType(['private', 'group', 'supergroup'], tap(user)))
updateChatInfo.use(Composer.groupChat(tap(updateGroups)))
updateChatInfo.use(Composer.chatType('channel', tap(updateChannels)))

module.exports = updateChatInfo

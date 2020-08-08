const { Composer } = require('telegraf')
const updatePrivate = require('./private')
const updateGroups = require('./groups')
const updateChannels = require('./channels')
const { tap } = require('../../utils/helpers')

const updateChatInfo = new Composer()

updateChatInfo.use(Composer.privateChat(tap(updatePrivate)))
updateChatInfo.use(Composer.groupChat(tap(updateGroups)))
updateChatInfo.use(Composer.chatType('channel', tap(updateChannels)))

// updateChatInfo.use(
//   tap(ctx => {
//     console.log(ctx.user)
//     ctx.user.lang = 'fr'
//   }),
// )

module.exports = updateChatInfo

const logger = require('nlogs')(module)
const { Chats } = require('../../db')

module.exports = async ctx => {
  if (!ctx.message) return
  const { message, botInfo, chat } = ctx
  const { left_chat_member, new_chat_member, new_chat_members, new_chat_title } = message

  if (
    (new_chat_members && new_chat_members.find(m => m.id === botInfo.id)) ||
    (new_chat_member && new_chat_member.id === ctx.botInfo.id)
  ) {
    await Chats.create({ ...chat, chatType: chat.type })
  } else if (left_chat_member && left_chat_member.id && botInfo.id) {
    await Group.findOneAndRemove({ id: chat.id })
    logger.info('remove from chat')
  } else if (new_chat_title) {
    await Chats.findOneAndUpdate({ id: chat.id }, { title: new_chat_title })
  }
}

const logger = require('nlogs')(module)
const { Group } = require('../../db')

module.exports = async ctx => {
  if (!ctx.message) return
  const { message, botInfo, chat } = ctx
  const { left_chat_member, new_chat_member, new_chat_members } = message

  if (
    (new_chat_members && new_chat_members.find(m => m.id === botInfo.id)) ||
    (new_chat_member && new_chat_member.id === ctx.botInfo.id)
  ) {
    await Group.create({ ...chat })
  } else if (left_chat_member && left_chat_member.id && botInfo.id) {
    await Group.findOneAndRemove({ id: chat.id })
    logger.info('remove from chat')
  } else {
    logger.debug(message)
  }
}

const { Chats } = require('../../db')

module.exports = async ctx => {
  const { chat, channelPost } = ctx

  if (!(await Chats.exists({ id: chat.id }))) {
    await Chats.create({ ...chat, chatType: chat.type })
  } else if (channelPost.new_chat_title) {
    await Chats.findOneAndUpdate({ id: chat.id }, { title: channelPost.new_chat_title })
  }
}

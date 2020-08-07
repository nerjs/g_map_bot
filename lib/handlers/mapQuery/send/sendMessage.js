const { Markup, Extra } = require('telegraf')

// ⤴️ 📍✍️👍👎✏️⚡️⛓⚙️🔗📂🗯📣📆📅📜🏷💰⏱🏞🗑❌✅➕↩️📢

const defaultOptions = {
  canLike: false,
  canShare: false,
  canShareSelf: false,
  canEdit: false,
  replyToMessage: null,
  addToQueue: false,
  sendToGroup: false,
}

const buildKeyboard = (result, { canLike, countLike, countDislike, canShare, canEdit, addToQueue, sendToGroup }) => {
  const buttons = []

  if (canLike)
    buttons.push([
      Markup.callbackButton(`👍 ${countLike || 0}`, 'like'),
      Markup.callbackButton(`${countDislike || 0} 👎`, 'dislike'),
    ])
  if (result.url) buttons.push([Markup.urlButton('show 🌏', result.url)])

  if (addToQueue || sendToGroup) {
    const addIdx = buttons.length
    buttons.push([])

    if (addToQueue) buttons[addIdx].push(Markup.callbackButton('add to queue 📂', `add:queue:${result.id}`))
    if (sendToGroup) buttons[addIdx].push(Markup.callbackButton('send to group 📣', `send:group:${result.id}`))
  }

  if (canEdit) buttons.push([Markup.callbackButton('edit ✍️', `edit:${result.id}`)])

  if (canShare) {
    const btn = Markup.switchToChatButton('share 📢', `share:${result.id}`)

    if (!buttons.length) buttons.push([btn])
    else if (canEdit) buttons[buttons.length - 1].push(btn)
    else buttons[0].unshift(btn)
  }

  return Markup.inlineKeyboard(buttons)
}

// todo: Динамические размеры низвания кнопок
module.exports = async (ctx, options = {}) => {
  const { result } = ctx
  if (!result.large || (!result.large.link && !result.large.tg)) throw new Error('Missing large img link/tgID')

  const { replyToMessage, ...keyboardOptions } = Object.assign({}, defaultOptions, options)

  const extra = new Extra()

  extra.markup(buildKeyboard(result, keyboardOptions))
  extra.markdown(true)
  extra.caption(`*${result.title}*\n${result.description || `${result.lat} : ${result.lng}`}`)

  if (replyToMessage)
    extra.inReplyTo(typeof replyToMessage === 'boolean' ? ctx.message && ctx.message.message_id : replyToMessage)

  const res = await ctx.replyWithPhoto(result.large.tg || result.large.link, extra)

  if (res.photo && res.photo.length) {
    await result.savePhotosTg(res.photo)
  }
}

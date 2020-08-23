const { User } = require('../../db')

module.exports = async ctx => {
  const currentUser = {
    id: ctx.from.id,
    chatId: ctx.chat.id,
    username: ctx.from.username,
    displayName: [ctx.from.first_name, ctx.from.last_name].filter(f => !!f).join(' ') || ctx.from.username || ctx.from.id,
    lang: ctx.from.language_code,
  }

  if (!ctx.session.user || Object.keys(currentUser).some(key => currentUser[key] !== ctx.session.user[key])) {
    let dbUser
    if (await User.exists({ id: currentUser.id })) {
      dbUser = await User.findOneAndUpdate({ id: currentUser.id }, currentUser)
    } else {
      dbUser = await User.create(currentUser)
    }
    ctx.session.user = { settings: {}, ...ctx.session.user, ...(dbUser.toObject() || {}), ...currentUser }
  }

  Object.defineProperty(ctx, 'user', {
    set(newUser) {
      if (newUser === null) {
        delete ctx.session.user
        User.findOneAndRemove({ id: currentUser.id })
      } else if (typeof newUser === 'object') {
        const { id, ...userObj } = newUser
        ctx.session.user = { ...ctx.session.user, ...userObj }
      }
    },
    get() {
      return ctx.session.user
    },
  })
}

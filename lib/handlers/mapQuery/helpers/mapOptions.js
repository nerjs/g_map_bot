const { User } = require('../../../db')

const defaultSettings = Object.entries(User.schema.tree.settings.type.tree).reduce(
  (p, [key, val]) => ({ ...p, [key]: val.default }),
  {},
)

module.exports = (ctx, options = {}) => ({
  ...defaultSettings,
  lang: 'en',
  ...((ctx.user && { ...(ctx.user.settings || {}), lang: ctx.user.lang }) || {}),
  ...options,
})

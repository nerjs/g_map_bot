const { User } = require('../../db')
const messages = require('./messages')

const fields = Object.keys(User.schema.tree.settings.type.tree)
  .map(key => ({
    ...User.schema.tree.settings.type.tree[key],
    key,
  }))
  .map(field => ({
    enum: field.enum,
    default: field.default,
    name: field.key,
    title: (messages[field.key] && messages[field.key].title) || field.key,
    msg: (messages[field.key] && messages[field.key].msg) || field.key,
    replyMsg: (messages[field.key] && messages[field.key].replyMsg) || null,
    type: (() => {
      if (field.type === Boolean) return 'bool'
      if (field.enum) return 'enum'
      if (field.type === Number) return 'number'
      return 'string'
    })(),
  }))

exports.parseFields = ctx =>
  fields.map(field => ({
    ...field,
    current:
      ctx.user && ctx.user.settings && ctx.user.settings.hasOwnProperty(field.name)
        ? ctx.user.settings[field.name]
        : field.default,
  }))

exports.getField = (ctx, fieldName) => exports.parseFields(ctx).find(field => field.name === fieldName)

exports.getNames = () => fields.map(({ name }) => name)

exports.saveField = async (ctx, fieldName, value) => {
  const user = await User.findOneAndUpdate(
    { id: ctx.user.id },
    { [`settings.${fieldName}`]: value },
    { new: true, runValidators: true },
  )
  ctx.session.user.settings = { ...ctx.session.user.settings, ...user.toObject().settings }
}

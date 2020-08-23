const { Markup, Extra } = require('telegraf')
const { parseFields, getField } = require('../fields')

exports.getTapMessage = (ctx, fieldName) => {
  const { title, type, enum: fieldEnum, msg, current } = getField(ctx, fieldName)
  const extra = new Extra()
  let message = msg
  extra.markdown(true)

  if (type === 'bool') {
    message = `${message}\n*Current\:* ${current ? '✅ enabled' : '☑️ disabled'}`
    extra.markup(
      Markup.inlineKeyboard(
        [Markup.callbackButton(`Turn ${current ? 'off' : 'on'}`, `settings:${fieldName}:${current ? 0 : 1}`)],
        { columns: 1 },
      ),
    )
  } else if (type === 'enum') {
    extra.markup(
      Markup.inlineKeyboard(
        fieldEnum
          .map((ef, i) => (ef === current ? null : { title: ef, idx: i }))
          .filter(f => !!f)
          .map(ef => Markup.callbackButton(ef.title, `settings:${fieldName}:${ef.idx}`)),
        { columns: 2 },
      ),
    )
  } else {
    extra.markup(Markup.inlineKeyboard([Markup.callbackButton('Edit', `settings:${fieldName}:1`)], { columns: 1 }))
  }

  extra.reply_markup.inline_keyboard.push([Markup.callbackButton('⬅️ Back', 'settings')])

  if (type !== 'bool') {
    message = `${message}\n*Current\:* \`${current}\``
  }

  return { title, message, extra }
}

exports.buildKeyboard = ctx =>
  Markup.inlineKeyboard(
    parseFields(ctx).map(({ title, name }) => Markup.callbackButton(title, `settings:${name}`)),
    { columns: 2 },
  )

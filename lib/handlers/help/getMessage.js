const { Markup } = require('telegraf')
const messages = require('./messages')

Object.keys(messages).forEach(key => {
  if (!messages[key].parents) return
  messages[key].parents.forEach(parent => {
    if (!messages[parent].childs) messages[parent].childs = []
    messages[parent].childs.push({ ...messages[key], key, parent })
  })
})

const sortButtons = arr =>
  arr.reduce((arr, cur, i) => {
    if (!(i % 2)) arr.push([])
    arr[arr.length - 1].push(cur)
    return arr
  }, [])

module.exports = (_code, parentCode) => {
  const code = _code && messages[_code] ? _code : 'core'
  const { title, msg, childs, parents } = messages[code]
  let buttons = []
  const parent = messages[parentCode]

  if (childs) {
    buttons = sortButtons(childs.map(ch => Markup.callbackButton(ch.title, `help:${ch.key}:${code}`)))

    buttons.push([
      parent ? Markup.callbackButton(parent.title, `help:${parentCode}`) : Markup.callbackButton('Back help', 'help:core'),
    ])
  } else if (parents && parent && parents.includes(parentCode) && parent.childs) {
    buttons = sortButtons(
      parent.childs.filter(ch => ch.key !== code).map(ch => Markup.callbackButton(ch.title, `help:${ch.key}:${parentCode}`)),
    )

    buttons.push([Markup.callbackButton(parent.title, `help:${parentCode}${parent.parents ? `:${parent.parents[0]}` : ''}`)])
  } else {
    buttons = sortButtons(
      Object.keys(messages)
        .filter(key => key !== 'core' && key !== code && !messages[key].parents)
        .map(key => Markup.callbackButton(messages[key].title, `help:${key}`)),
    )

    if (code !== 'core') buttons.push([Markup.callbackButton('Help', 'help:core')])
  }

  return {
    code,
    msg,
    title,
    keyboard: Markup.inlineKeyboard(buttons),
  }
}

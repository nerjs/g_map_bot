const { Markup } = require('telegraf')
const messages = require('./messages')

module.exports = _code => {
  const code = _code && messages[_code] ? _code : 'core'

  return {
    ...messages[code],
    keyboard: Markup.inlineKeyboard(
      Object.keys(messages)
        .filter(key => key !== code)
        .sort(key => (key === 'core' ? 1 : -1))
        .map(key => Markup.callbackButton(messages[key].title, `help:${key}`)),
      { columns: 2 },
    ),
  }
}

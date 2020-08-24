exports.prepareMarkdownMsg = msg => `${msg}`.replace(/(\.|:|\(|\)|\||\\|\/|\=|\-|\<|\>)/g, '\\$1')

exports.commandSubtype = (text = '', entities = []) => {
  if (!text || !text.length || !entities || !entities.length) return text
  const ent = entities.find(en => en.type === 'bot_command' && en.offset === 0)
  if (!ent) return text
  return `${text}`.slice(ent.length).trim()
}

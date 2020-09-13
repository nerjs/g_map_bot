const { isUrl } = require('../../../utils/str')
const UrlParser = require('../../../utils/UrlParser')

module.exports = async (ctx, inputText, removeKeyboard) => {
  console.log('URL', isUrl(inputText), new UrlParser(inputText))

  if (!isUrl(inputText)) return false

  const parsedUrl = new UrlParser(inputText)
  if (!parsedUrl.success) return false

  console.log(parsedUrl)

  return true
}

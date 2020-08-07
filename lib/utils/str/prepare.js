exports.prepareMarkdownMsg = msg =>
  `${msg}`
    .trim()
    .replace(/\./g, '.')
    .replace(/:/g, ':')

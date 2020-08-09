exports.prepareMarkdownMsg = msg => `${msg}`.replace(/(\.|:|\(|\)|\||\\|\/|\=|\-|\<|\>)/g, '\\$1')

const { Composer, Markup } = require('telegraf')
const inline = require('./inline')

const send = new Composer()

send.on('inline_query', inline)

module.exports = send

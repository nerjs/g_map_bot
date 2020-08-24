const { Composer, Markup } = require('telegraf')
const inlineSend = require('./inline')
const privateSend = require('./private')
const publicSend = require('./public')
const startSend = require('./start')

const send = new Composer()

send.command('start', startSend)
send.on('inline_query', inlineSend)
send.on('text', Composer.privateChat(privateSend))
send.on('text', Composer.groupChat(publicSend))

module.exports = send

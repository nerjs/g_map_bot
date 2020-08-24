const path = require('path')
const moment = require('moment')
const { User } = require('../../db')

const startTime = Date.now()
const { version } = require(path.join(process.cwd(), 'package.json'))

module.exports = async ctx =>
  ctx.replyWithMarkdownV2(
    `
• *Version*: ${version};
• *Users*: ${await User.estimatedDocumentCount()};
• *Uptime*: _${moment(startTime).fromNow(true)}_;
• *Source*: [github](https://github.com/nerjs/g_map_bot);
`.replace(/(\.|\+)/g, '\\$1'),
    { disable_web_page_preview: true },
  )

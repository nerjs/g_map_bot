require('dotenv').config()
const fs = require('fs-extra')
const path = require('path')
const logger = require('nlogs')(module)
const sleep = require('helpers-promise/sleep')
const bot = require('../../utils/bot')
const { User, Changelog, autoConnect } = require('../../db')
const { prepareMarkdownMsg } = require('../../utils/str')

const filePath = path.join(__dirname, 'log.md')
const { version } = require(path.join(process.cwd(), 'package.json'))
const LIMIT_USERS = 10
const SLEEP_TIMEOUT = 1000

const sendMessages = async str => {
  let offset = 0
  let count = 0

  logger.info(`Count users: ${await User.countDocuments()}`)

  while (
    (users = await User.find()
      .skip(offset)
      .limit(LIMIT_USERS)
      .sort({ createdAt: -1 })
      .select('id chatId')).length
  ) {
    offset += LIMIT_USERS

    for (user of users) {
      if (!user.chatId) continue

      try {
        await bot.telegram.sendMessage(user.chatId, str, { parse_mode: 'MarkdownV2', disable_web_page_preview: true })
        count++
      } catch (e) {
        logger.error(e)
      }
    }

    await sleep(SLEEP_TIMEOUT)
  }

  return count
}

;(async () => {
  await autoConnect()

  if (!(await fs.exists(filePath))) return
  const fileTxt = `${await fs.readFile(filePath)}`

  const lastLog = await Changelog.findOne({}).sort({ createdAt: -1 })

  if (lastLog && lastLog.version === version) return
  await Changelog.create({ version, text: fileTxt })

  const message = `🤖 ***Updated bot version\: _${prepareMarkdownMsg(
    `${(lastLog && lastLog.version) || '0.0.0'} => ${version}`,
  )}_*** \n\n${fileTxt}`

  logger.info('Updated version:', { prev: (lastLog && lastLog.version) || '0.0.0', current: version })

  return sendMessages(message)
})()
  .then(messagesCount => {
    logger.log(`Success send ${messagesCount || 0} messages`)
    process.exit(0)
  })
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

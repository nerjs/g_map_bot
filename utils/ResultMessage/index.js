const logger = require('nlogs')(module)
const { Markup } = require('telegraf')
const QueryResult = require('../QueryResult')
const { BotError } = require('../error')
const { INCORRECT_CONTRUCTOR_ARG, UNKNOWN_ERROR } = require('../../messages/errors')
const { CACHE_TIME } = require('../../constants')
const { inlineCache } = require('../cache')
const { createCacheId } = require('../str')

class ResultMessage {
  constructor(result, ctx) {
    if (!(result instanceof QueryResult)) throw new BotError(INCORRECT_CONTRUCTOR_ARG, UNKNOWN_ERROR, { result })
    if (!result.hasResult) throw new BotError('Empty result', UNKNOWN_ERROR, { result })
    this.result = result
    this.ctx = ctx
  }

  message() {
    let msg = `*${this.result.title}*\n`
    msg += `_${this.result.lat}:${this.result.lng}_`

    return msg.replace('.', '\\.').replace(':', '\\:')
  }

  markup() {
    const markup = {}
    const inline = []

    const { reaction, link, edit } = this.result.settings

    if (link) inline.push([Markup.urlButton('link', this.result.url)])

    if (reaction) inline.push([Markup.callbackButton('👍 0', 'like'), Markup.callbackButton('0 👎', 'dislike')])

    if (this.isPrivate()) inline.push([Markup.callbackButton('edit', `edit:${this.result.id}`)])

    if (inline.length) markup.inline_keyboard = inline

    return markup
  }

  async extra() {
    const extra = {}

    if (this.isInlineQuery()) {
      await inlineCache.set(this.ctx, this.result)
      extra.cache_time = CACHE_TIME.INLINE_HAS_RESULT
      extra.switch_pm_text = 'Edit message'
      extra.switch_pm_parameter = createCacheId(inlineCache.getId(this.ctx))
    } else {
      extra.reply_markup = this.markup()
      extra.parse_mode = 'MarkdownV2'

      if (this.result.img) {
        extra.caption = this.message()
      }
    }

    return extra
  }

  inlineQuery() {}

  inlineQueryResult() {
    const result = {
      id: this.result.id,
      type: this.result.img ? ResultMessage.inlineResultTypes.PHOTO : ResultMessage.inlineResultTypes.ARTICLE,
      title: this.result.title,
      description: this.result.description,
    }

    if (this.result.img) {
      result.caption = this.message()
      result.parse_mode = 'Markdown'
      result.photo_url = this.result.img.link
      result.photo_width = this.result.img.width
      result.photo_height = this.result.img.height
    } else {
      result.input_message_content = {
        message_text: this.message(),
        parse_mode: 'Markdown',
      }
    }

    if (this.result.thumb) {
      result.thumb_url = this.result.thumb.link
      result.thumb_width = this.result.thumb.width
      result.thumb_height = this.result.thumb.height
    }

    result.reply_markup = this.markup()

    return result
  }

  async send() {
    if (this.isInlineQuery()) {
      return this.ctx.answerInlineQuery([this.inlineQueryResult()], await this.extra())
    }

    if (this.isMessage()) {
      console.log('message')
      if (this.result.img) {
        console.log('img')
        return this.ctx.replyWithPhoto(this.result.img.link, await this.extra())
      } else {
        return this.ctx.replyWithMarkdown(this.message(), await this.extra())
      }
    }
  }

  isInlineQuery() {
    return this.ctx.updateType === ResultMessage.updateTypes.INLINE_QUERY
  }

  isMessage() {
    return this.ctx.updateType === ResultMessage.updateTypes.MESSAGE
  }

  isPrivate() {
    return this.isMessage() && this.ctx.chat && this.ctx.chat.type === ResultMessage.chatTypes.PRIVATE
  }

  isGroup() {
    return (
      this.isMessage() &&
      this.ctx.chat &&
      (this.ctx.chat.type === ResultMessage.chatTypes.SUPERGROUP || this.ctx.chat.type === ResultMessage.chatTypes.GROUP)
    )
  }

  static inlineResultTypes = {
    PHOTO: 'photo',
    ARTICLE: 'article',
  }

  static updateTypes = {
    INLINE_QUERY: 'inline_query',
    MESSAGE: 'message',
  }

  static chatTypes = {
    PRIVATE: 'private',
    GROUP: 'group',
    SUPERGROUP: 'supergroup',
  }
}

module.exports = ResultMessage

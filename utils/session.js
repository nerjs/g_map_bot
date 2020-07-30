const RedisSession = require('telegraf-session-redis')
const { Context } = require('telegraf')
const { getRedisParams } = require('./redis')
const { REDIS_DBS, TTL } = require('../constants')

const getKey = (userId, chatId) => {
  if (userId instanceof Context) {
    if (!userId.from || !userId.chat) return null
    return getKey(userId.from.id, userId.chat.id)
  }

  return `${userId}::${chatId}`
}

module.exports = new RedisSession({
  store: getRedisParams(REDIS_DBS.TG_SESSION),
  getSessionKey: getKey,
  ttl: TTL.TG_SESSION,
})

module.exports.getKey = getKey

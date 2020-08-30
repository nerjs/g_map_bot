const redis = require('redis')
const util = require('util')
const { REDIS_DBS } = require('../constants')

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const getRedisParams = (db = REDIS_DBS.DEFAULT) => ({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD, db })

const getClient = db => {
  const client = redis.createClient(getRedisParams(db))

  ;['get', 'set', 'del', 'expire'].forEach(method => {
    client[method] = util.promisify(client[method]).bind(client)
  })

  return client
}

exports.getRedisParams = getRedisParams
exports.getClient = getClient

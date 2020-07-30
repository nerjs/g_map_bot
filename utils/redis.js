const redis = require('redis')
const { REDIS_DBS } = require('../constants')

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const getRedisParams = (db = REDIS_DBS.DEFAULT) => ({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD, db })

const getClient = db => redis.createClient(getRedisParams(db))

exports.getRedisParams = getRedisParams
exports.getClient = getClient

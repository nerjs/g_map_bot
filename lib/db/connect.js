const mongoose = require('mongoose')
const waitPort = require('wait-port')
const merge = require('merge')
const logger = require('nlogs')(module)
const { sleep } = require('helpers-promise')

const paramsDbDefault = {
  dbProtocol: 'mongodb',
  dbHost: 'localhost',
  dbPort: 27017,
  dbName: 'db',
  dbMaxTryConnect: 10,
  useUnifiedTopology: true,
  bufferCommands: true, // default
  autoIndex: true, // default
  useNewUrlParser: true, // default
  useCreateIndex: true,
  // useFindAndModify: true,
  // promiseLibrary: Promise,
  poolSize: 5, // default
  useUnifiedTopology: true, // default false
}

mongoose.set('useFindAndModify', false)

const connect = _params => {
  const { dbProtocol, dbHost, dbPort, dbName, dbUser, dbPassword, dbMaxTryConnect, ...params } = merge(
    {},
    paramsDbDefault,
    _params,
  )

  const paramsWaitPort = {
    host: dbHost,
    port: Number(dbPort),
    output: 'silent',
  }

  const dbAuth = (() => {
    if (!dbUser && !dbPassword) return ''
    params.user = dbUser
    params.pass = dbPassword
    return `${dbUser}:${dbPassword}@`
  })()

  const dbUri = `${dbProtocol}://${dbAuth}${dbHost}:${Number(dbPort)}/${dbName}?authSource=admin&readPreference=primary`

  const tryConnect = async i => {
    i++
    await waitPort(paramsWaitPort)

    try {
      await mongoose.connect(dbUri, { dbName, ...params })
      logger.log('MongoDb connected!')
      return mongoose.connection
    } catch (err) {
      err.tryCount = i
      if (i >= Number(dbMaxTryConnect)) throw err
      await sleep(i * 100)
      if (i >= Number(dbMaxTryConnect) / 2) logger.debug(`[try:${i}] Next try db connect...`)
      return await tryConnect(i)
    }
  }

  return tryConnect(0)
}

const autoConnect = () => {
  const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME, MONGODB_PROTOCOL, MONGODB_HOST, MONGODB_PORT } = process.env

  return connect({
    dbProtocol: MONGODB_PROTOCOL || 'mongodb',
    dbHost: MONGODB_HOST,
    dbPort: MONGODB_PORT,
    dbName: MONGODB_DBNAME,
    dbUser: MONGODB_USERNAME,
    dbPassword: MONGODB_PASSWORD,
  })
}

exports.connect = connect
exports.autoConnect = autoConnect
exports.connection = mongoose.connection

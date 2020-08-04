const path = require('path')
const fs = require('fs-extra')
const logger = require('nlogs')(module)
const { ROOT_DIR } = require('./constants')
const Files = require('./Files')

exports.setupFiles = fs
  .ensureDir(ROOT_DIR)
  .then(() => fs.emptyDir(ROOT_DIR))
  .then(() => fs.writeFile(path.join(ROOT_DIR, 'status'), 'OK'))
  .then(() => logger.info('Status file created'))
  .then(() => fs.stat(path.join(ROOT_DIR, 'status')))
  .then(() => logger.info('Files ready'))
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

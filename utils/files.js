const path = require('path')
const fs = require('fs-extra')
const logger = require('nlogs')(module)

const filesDir = path.join(process.cwd(), 'files')

module.exports = fs
  .ensureDir(filesDir)
  .then(() => fs.emptyDir(filesDir))
  .then(() => fs.writeFile(path.join(filesDir, 'status'), 'OK'))
  .then(() => logger.info('Status file created'))
  .then(() => fs.stat(path.join(filesDir, 'status')))
  .then(() => logger.info('Files ready'))
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

const path = require('path')
const fs = require('fs-extra')
const logger = require('nlogs')(module)

const filesDir = path.join(__dirname, 'files')

module.exports = fs
  .ensureDir(filesDir)
  .then(() => fs.emptyDir(filesDir))
  .then(() => fs.writeFile(path.join(filesDir, 'status'), 'OK'))
  .then(() => logger.info('Files ready'))
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

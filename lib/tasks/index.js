const child_process = require('child_process')
const util = require('util')
const fs = require('fs-extra')
const path = require('path')
const logger = require('nlogs')(module)
const versions = require('./versions')
const dbIndexes = require('./dbIndexes')

const exec = util.promisify(child_process.exec)

const execTask = async taskName => {
  const taskPath = path.join(__dirname, taskName)
  if (!(await fs.exists(taskPath))) throw new Error(`Not found task ${taskName}`)

  const { stdout, stderr } = await exec(`node ${taskPath}`)

  console.log(stderr || stdout)
}

module.exports = async () => {
  const { version, prevVersion, changed } = await versions()

  if (!changed) return

  await dbIndexes()

  execTask('changelog')
    .then(() => logger.info('changelog send'))
    .catch(logger.error)
}

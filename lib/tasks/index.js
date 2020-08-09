const child_process = require('child_process')
const util = require('util')
const fs = require('fs-extra')
const path = require('path')

const exec = util.promisify(child_process.exec)

module.exports = async taskName => {
  const taskPath = path.join(__dirname, taskName)
  if (!(await fs.exists(taskPath))) throw new Error(`Not found task ${taskName}`)

  const { stdout, stderr } = await exec(`node ${taskPath}`)

  console.log(stderr || stdout)
}

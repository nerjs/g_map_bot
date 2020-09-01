const { Options } = require('../../db')

const packageVersion = process.env.npm_package_version

module.exports = async () => {
  const res = {
    changed: false,
    version: await Options.get('version'),
    prevVersion: await Options.get('prevVersion'),
  }

  if (res.version === packageVersion) return res

  res.prevVersion = res.version
  res.version = packageVersion
  res.changed = true

  await Promise.all([Options.set('version', res.version), Options.set('prevVersion', res.prevVersion || '0.0.0')])

  return res
}

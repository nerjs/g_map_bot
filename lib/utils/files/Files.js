const fs = require('fs-extra')
const path = require('path')
const { filesCache } = require('../cache')
const { ROOT_DIR } = require('./constants')

class Files {
  constructor() {
    this.cache = filesCache
  }

  async get(id) {
    const data = await this.cache.get(id)
    if (!data) return null

    if (data.url || data.tg) return data

    const fullPath = path.join(ROOT_DIR, data.path)

    if (!data.path || !(await fs.pathExists(fullPath))) {
      await this.cache.remove(id)
      return null
    }
    return { ...data, fullPath }
  }

  async set(id, { data, url, tg, ...params } = {}) {
    if (!data && !url && !tg) throw new Error('Required one of [data, url, tg] in set(,params)')

    const prev = (await this.get(id)) || {}

    if (prev.fullPath) {
      await fs.unlink(prev.fullPath)
    }

    const newFile = { width: prev.width, height: prev.height, ...params }

    if (url) newFile.url = url
    if (tg) newFile.tg = tg

    if (data) {
      const filePath = path.join(`${parseInt(Date.now() / 1000 / 60 / 60)}`, id)
      await fs.outputFile(path.join(ROOT_DIR, filePath), data)
      newFile.path = `/${filePath}`
    }

    await this.cache.set(id, newFile)
    return newFile
  }

  async remove(id) {
    const saved = await this.get(id)
    if (!saved) return false

    if (saved.fullPath) {
      await fs.unlink(saved.fullPath)
    }

    await this.cache.remove(id)

    return true
  }
}

module.exports = Files

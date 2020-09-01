const { models } = require('mongoose')
const { Options } = require('../../db')

module.exports = async () => {
  const savedIndexes = (await Options.get('db_indexes')) || {}

  for (let modelName in models) {
    let Model = models[modelName]
    const idx = JSON.stringify(Model.schema.indexes())
    if (savedIndexes[modelName] !== idx) {
      savedIndexes[modelName] = idx
      await Model.syncIndexes()
    }
  }

  await Options.set('db_indexes', savedIndexes)
}

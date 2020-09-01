const { model } = require('mongoose')
const { schema, TYPES, numberSchema, stringSchema, boolSchema, dateSchema } = require('./schema')
const OptionsDb = require('./class')

schema.loadClass(OptionsDb)

const Options = model('Options', schema)

Options.discriminator(TYPES.NUMBER, numberSchema)
Options.discriminator(TYPES.STRING, stringSchema)
Options.discriminator(TYPES.BOOL, boolSchema)
Options.discriminator(TYPES.DATE, dateSchema)

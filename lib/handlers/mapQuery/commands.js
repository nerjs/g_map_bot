const { commandSubtype } = require('../../utils/str')
const searchText = require('./helpers/searchText')
const coordinatesText = require('./helpers/coordinatesText')

exports.search = async ctx => searchText(ctx, commandSubtype(ctx.message.text, ctx.message.entities))

exports.coordinates = async ctx => coordinatesText(ctx, commandSubtype(ctx.message.text, ctx.message.entities))

const logger = require('nlogs')(module)
const { Composer } = require('telegraf')
const { User } = require('../db')

const updateUser = new Composer()

module.exports = updateUser

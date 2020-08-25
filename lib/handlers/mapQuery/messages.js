const Request = require('./helpers/MapQuery/Request')

exports.incorrectRandomSubtype = `
Incorrect value. 
Supported: ${Object.values(Request.SUBTYPES[Request.TYPES.RANDOM]).join(', ')}
`

exports.incorrectCoordsFormat = `
Incorrect coordinates.
See: /help ➡️ "Coordinates"
`

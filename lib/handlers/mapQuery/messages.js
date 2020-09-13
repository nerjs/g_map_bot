const { RANDOM_SUBTYPES } = require('../../constants')

exports.incorrectRandomSubtype = `
Incorrect value. 
Supported: ${Object.values(RANDOM_SUBTYPES).join(', ')}
`

exports.incorrectCoordsFormat = `
Incorrect coordinates.
See: /help ➡️ "Coordinates"
`

exports.incorrectUrl = `
Incorrect url.
See: /help ➡️ "Url"
`
exports.incorrectSearch = `
Incorrect search string.
See: /help ➡️ "Search"
`

exports.incorrectCoordinates = `
Incorrect coordinates format.
See: /help ➡️ "Coordinates"
`

exports.inputSearchText = 'Search:'

exports.inputCoordinatesText = 'Coordinates:'

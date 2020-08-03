class BotError extends Error {
  constructor(systemMessage, clientMessage, _details) {
    let message,
      details = {}

    if (_systemMessage instanceof Error) {
      message = systemMessage.message
      details = { ...systemMessage }
      details.originalError = systemMessage
    } else if (typeof systemMessage === 'string') {
      message = systemMessage
    } else {
      message = 'Unknown error'
    }

    super(message)

    if (typeof clientMessage === 'object') {
      details = { ...details, ...clientMessage }
    } else if (typeof clientMessage === 'string') {
      this.clientMessage = clientMessage
    }

    details = { ...details, ...(_details || {}) }
    if (details.originalError) {
      this.originalError = details.originalError
      delete details.originalError
    }

    this.name = 'BotError'

    if (Object.keys(details).length) this.details = details
  }
}

exports.BotError = BotError

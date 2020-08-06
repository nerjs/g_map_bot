const util = require('util')

const OUT_HANDLER = Symbol('OUT HANDLER')

class Out {
  constructor(OutClassHandler) {
    if (OutClassHandler) {
      this[OUT_HANDLER] = () => {
        const props = { ...this }
        delete props[OUT_HANDLER]

        return new OutClassHandler(props)
      }
    }
  }

  toJSON() {
    return this[OUT_HANDLER]()
  }

  [util.inspect.custom]() {
    return this[OUT_HANDLER]()
  }

  [OUT_HANDLER]() {
    return this
  }
}

module.exports = Out

const util = require('util')

class Out {
  out() {
    return { ...this }
  }

  toJSON() {
    return this.out()
  }

  [util.inspect.custom]() {
    return this.out()
  }
}

module.exports = Out

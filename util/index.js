const crypto = require('crypto')
const { Buffer } = require('buffer')

class Util {
  /**
   * getFileName
   * @param {String} url Url data source
   * @returns {String} json file name built
   */
  getFileName (url = '') {
    if (url === '') {
      url = this.getRandomString()
    }
    return url.replace(/[/:_-]/g, '') + '.json'
  }

  /**
   * getRandomString
   * @param {String} size String size. Default = 10
   * @returns {String} Random string generated
   */
  getRandomString (size = 10) {
    return crypto
      .randomBytes(size)
      .toString('base64')
      .slice(0, size)
  }

  /**
   * getStringInfo
   * @param {String} str String to evaluate
   * @returns {Object} Size and string length
   */
  getStringInfo (str = '') {
    const size = Buffer.byteLength(str, 'utf8')
    return {
      length: str.length,
      size: {
        b: size,
        kb: size / 1000
      },
      str
    }
  }
}

const util = new Util()

module.exports = util

const querystring = require('querystring')
const axios = require('axios')

const files = require('./files')
const { config } = require('dotenv')
const key = process.env.DEEPL_KEY
const API_BASE_URL = 'https://api-free.deepl.com'

class DeepL {
  constructor (key) {
    this.key = key
    this.apiBaseUrl = API_BASE_URL
    this.apiUsageURL = `${this.apiBaseUrl}/v2/usage?auth_key=${this.key}`
    this.apiTranslateUrl = `${this.apiBaseUrl}/v2/translate?auth_key=${this.key}`
  }

  /**
   * translateLine
   * @param {String} str String to translate
   * @param {String} sourceLang Source language
   * @param {String} targetLang Target language
   * @returns {Promise} The result of deepL api request
   */
  async translateLine (
    str = '',
    sourceLang = 'EN',
    targetLang = 'ES'
  ) {
    if (str === '') return {}
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    const params = querystring.stringify({
      auth_key: this.key,
      text: str,
      source_lang: 'EN',
      target_lang: 'ES'
    })
    return { url: this.apiTranslateUrl, params, config }
    // return axios.post(
    //   this.apiTranslateUrl,
    //   params,
    //   config
    // ).then(r => r.data)
  }

  async translateMultipleLines (
    strArray = [],
    sourceLang = 'EN',
    targetLang = 'ES'
  ) {
    if (!Array.isArray(strArray) || !strArray.length) {
      return {}
    }

  }

  async getStatus () {
    return axios
      .get(this.apiUsageURL)
      .then(response => response.data)
  }

  /**
   * translateFile
   * TODO
   * @param {String} path File path
   * @returns {Promise} The result of deepL api request
   */
  async translateFile (path) {
    // TODO: build this fn
    if (!files.isFile(path)) return {}
  }
}

const deepL = new DeepL(key)

module.exports = deepL

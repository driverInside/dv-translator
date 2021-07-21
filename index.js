require('dotenv').config()
const { getReadme } = require('./lib/md')
const deepL = require('./lib/translate')
const files = require('./lib/files')
const util = require('./util')

const FILE_NAME = 'links.txt'

/**
 * getAPIStatus
 * @description Sends a request to the /v2/usage DeepL api endpoint
 *              in order to know the api usage and the characters
 *              remaining in the free plan limit
 * @example
 *         const {
 *                 character_count: characterCount,
 *                 character_limit: characterLimit
 *         } = await getAPIStatus()
 *
 * @returns {Promise} Object with the api response.
 */
async function getAPIStatus () {
  return deepL.getStatus()
}

async function init () {
  
  // const {
  //   character_count: characterCount,
  //   character_limit: characterLimit
  // } = await deepL.getStatus()

  for await (const url of rl) {
    const resultData = []
    const data = await getReadme(url)
    if (data.lines.length) {
      const fileName = util.getFileName(url)
      console.log('----------------------')
      console.log(fileName)
      for (let i = 0; i < data.lines.length; i++) {
        const { isSnippet, line } = data.lines[i]
        totalCharacters += line.length
        // https://www.deepl.com/docs-api/accessing-the-api/limits/
        if (!isSnippet && !line.size.kb < 30) {
          const { str } = line
          const translation = await deepL.translateLine(str)
          console.log(translation)
          console.log(line.size.kb, isSnippet)
          console.log('----------------------')
        }
      }
    }
    // files.writeFile(
    //   `files/${fileName}`,
    //   JSON.stringify(resultData, null, 2)
    // )
  }
}

/**
 * translate
 * @description Extract the content of a list of README github files
 *              and tries to translate the text using the
 *              DeepL api service then, save the result in a new
 *              file.
 * @example
 *         const {
 *                 character_count: characterCount,
 *                 character_limit: characterLimit
 *         } = await getAPIStatus()
 *         await translate(characterCount, characterLimit)
 * @param {Number} characterCount Number of characters translated
 *                                previously using the DeepL api.
 * @param {Number} characterLimit Number of characters limit.
 *        DeepL has 500000 characters by default as limit.
 * @returns {Promise} Object with the result of the translation operation.
 */
async function translate (characterCount, characterLimit) {
  files.createFolder('files')
  const rl = files.getRLFile(FILE_NAME)
  if (!rl) {
    throw new Error('File not found')
  }
  let totalCharacters = 0

  for await (const url of rl) {
    const resultData = []
    const data = await getReadme(url)
    if (data.lines.length) {
      const fileName = util.getFileName(url)
      console.log('----------------------')
      console.log(fileName)
      for (let i = 0; i < data.lines.length; i++) {
        const { isSnippet, line } = data.lines[i]
        totalCharacters += line.length
        if (!isSnippet && !line.size.kb < 30) {
          const { str } = line
          const translation = await deepL.translateLine(str)
          console.log(translation)
          console.log(line.size.kb, isSnippet)
          console.log(`
            caracteres usados en el api: ${characterCount + totalCharacters}.
            caracteres en esta línea: ${line.length}.
            caracteres que restan: ${characterLimit - (characterCount + totalCharacters)}
          `)
          console.log(totalCharacters)
          console.log('----------------------')
        }
      }
    }
  }
}

Promise
  .resolve(getAPIStatus())
  .then(status => {
    const {
      character_count: characterCount,
      character_limit: characterLimit
    } = status
    console.log('----------------------')
    console.log(characterCount, characterLimit)
    console.log('----------------------')
    return translate(characterCount, characterLimit)
  })
  .catch(err => {
    console.error(err)
  })

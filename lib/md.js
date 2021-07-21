const cheerio = require('cheerio')

const { getMD } = require('./request')
const util = require('../util')

const SNIPPET_CLASS = 'snippet-clipboard-content'

const getMDText = async (url = '') => {
  if (url === '') return {}
  const rawText = await getMD(url)
  const lines = rawText.split(/\n/)

  if (!lines.length) return {}

  return {
    text: rawText,
    lines: lines.reduce((acc, str) => {
      if (str && str.length) {
        acc.push(util.getStringInfo)
      }
      return acc
    }, []),
    url
  }
}

const getReadme = async (url = '') => {
  if (url === '') return {}

  const rawText = await getMD(url)
  const $ = cheerio.load(rawText)
  const lines = []
  const rawLines = []
  $('div#readme > article').children().each((i, el) => {
    const element = $(el)
    const isSnippet = element.hasClass(SNIPPET_CLASS)
    const text = element.text().trim()
    if (text && text.length) {
      rawLines.push(text)
      lines.push({
        line: util.getStringInfo(text),
        isSnippet
      })
    }
  })

  return {
    rawText,
    lines,
    rawLines,
    url
  }
}

module.exports = {
  getMDText,
  getReadme
}

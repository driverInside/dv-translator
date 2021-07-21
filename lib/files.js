const fs = require('fs')
const readline = require('readline')

class Files {
  isFile (posiblePath = '') {
    if (posiblePath === '') return false
    try {
      return fs.statSync(posiblePath).isFile()
    } catch (_) {
      return false
    }
  }

  getFile (path) {
    return this.isFile(path) ? fs.readFileSync(path) : Buffer.from(path || '')
  }

  getRLFile (path) {
    if (!this.isFile(path)) return null
    const fileStream = fs.createReadStream(path)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    return rl
  }

  createFolder (path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
  }

  writeFile (path = '', data = '') {
    if (path === '') return
    fs.writeFileSync(path, data)
  }
}

module.exports = new Files()

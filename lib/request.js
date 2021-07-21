const axios = require('axios')

const getMD = async function (url) {
  if (!url || url === '') {
    throw new Error('No url provided')
  }
  return axios.get(url)
    .then(response => response.data)
    .catch(err => {
      console.error(err)
      throw err
    })
}

module.exports = {
  getMD
}

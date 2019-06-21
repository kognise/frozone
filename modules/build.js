const fs = require('fs-extra')
const { transformAll, getPages, log } = require('../util')

module.exports = (data) => {
  log('Building files...')
  fs.emptyDirSync(data.dist)
  
  let errored = false
  try {
    transformAll(data.src, data.dist)
    data.pages = getPages(data.dist)
  } catch(error) {
    log('Error building!', true, 'red')
    log(error.message, true, 'red')
    errored = true
  }

  fs.removeSync(data.dist)
  if (!errored) log('Done building', false)
}
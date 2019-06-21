const fs = require('fs-extra')
const { log } = require('../util')

module.exports = (data) => {
  fs.emptyDirSync(data.out)
  if (!data.pages) return

  for (let page in data.pages) {
    log(`Outputting ${page}`)
    fs.outputFileSync(`${data.out}/${page}.html`, data.pages[page])
  }
  
  log(`Done building static pages!`, true, 'green')
}
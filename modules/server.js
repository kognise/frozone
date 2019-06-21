const http = require('http')
const { resolve, inject, log } = require('../util')

module.exports = (data) => {
  if (data.static) return

  http.createServer((req, res) => {
    if (!data.pages) {
      res.statusCode = 500
      res.write('Internal server error')
    } else {
      const resolved = resolve(req.url, data.pages)
      if (resolved) {
        res.write(data.injectScript ? inject(data.injectScript, resolved) : resolved)
      } else {
        res.statusCode = 404
        res.write('Not found')
      }
    }

    res.end()
  }).listen(data.port)

  log(`Server started at http://localhost:${data.port}/`, true, 'green')
}
const chokidar = require('chokidar')
const WebSocket = require('ws')
const build = require('./build')
const { log } = require('../util')

module.exports = (data) => {
  const wss = new WebSocket.Server({ port: data.lrPort })
  const buildAndReload = () => {
    build(data)
    for (let client of wss.clients) {
      client.send('reload')
    }
  }

  chokidar.watch(data.src, { ignoreInitial: true })
    .on('add', buildAndReload)
    .on('change', buildAndReload)
    .on('unlink', buildAndReload)

  data.injectScript = `
    const ws = new WebSocket('ws://localhost:${data.lrPort}/')
    ws.addEventListener('message', () => window.location.reload())
  `
  log('Watching for changes')
}
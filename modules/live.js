const WebSocket = require('ws')
const chokidar = require('chokidar')
const build = require('./build')
const path = require('path')
const { log } = require('../util')

module.exports = (data) => {
  const wss = new WebSocket.Server({ port: data.lrPort })

  const buildAndReload = () => {
    build(data)
    for (let client of wss.clients) {
      client.send('reload')
    }
  }
  const ignored = (child) => !path.relative(data.dist, child).startsWith('..')

  chokidar.watch(`${process.cwd()}/${data.src}`, { ignoreInitial: true, ignored })
    .on('add', buildAndReload)
    .on('change', buildAndReload)
    .on('unlink', buildAndReload)

  data.injectScript = `
    const ws = new WebSocket('ws://localhost:${data.lrPort}/')
    ws.addEventListener('message', () => window.location.reload())
  `
  log('Watching for changes', true)
}
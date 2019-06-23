const arg = require('arg')
const chalk = require('chalk')
const { getConfig, log } = require('../util')
const {
  transformJavaScript, buildPages, copyStaticFiles,
  startLiveReload, startServer
} = require('../steps')

const args = arg({
  '--help': Boolean,
  '--src': String,
  '--dist': String,
  '--port': Number,
  '--lr-port': Number,

  '-h': '--help',
  '-p': '--port'
})

if (args['--help']) {
  console.log(`
    ${chalk.bold('Description')}
      Starts your site in development mode, featuring
      live reloading

    ${chalk.bold('Usage')}
      $ frozone dev [options]

    ${chalk.bold('Options')}
      --help, -h       Display this message
      --port, -p       The port for the server to listen on
      --lr-port        The port for the live reload server to listen on
      --src            The directory with the source code
      --dist           A directory that will be created for build files
  `)
} else {
  const src = args['--src'] || './'
  const dist = args['--dist'] || '.frozone/'
  const port = args['--port'] || 3000
  const lrPort = args['--lr-port'] || 3001

  const config = getConfig(src)

  const build = async () => {
    let errored = false
    try {
      log('Transforming JavaScript...')
      transformJavaScript(config, src, dist)

      log('Building pages...')
      await buildPages(config, dist, false)

      log('Copying static files...')
      copyStaticFiles(config, src, dist)
    } catch(error) {
      log('Error building!', true, 'red')
      log(error.message, true, 'red')
      errored = true
    }

    if (!errored) log('Done building')
    return errored
  }

  build().then(() => {
    const script = startLiveReload(config, lrPort, src, dist, build)
    log('Watching for changes', true)
  
    startServer(config, port, dist, script)
    log(`Started server at http://localhost:${port}/`, true, 'green')
  })
}
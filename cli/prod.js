const arg = require('arg')
const chalk = require('chalk')
const { log } = require('../util')
const {
  transformJavaScript, buildPages, copyStaticFiles,
  startServer
} = require('../steps')

const args = arg({
  '--help': Boolean,
  '--src': String,
  '--dist': String,
  '--port': Number,

  '-h': '--help',
  '-p': '--port'
})

if (args['--help']) {
  console.log(`
    ${chalk.bold('Description')}
      Starts your site in production mode

    ${chalk.bold('Usage')}
      $ frozone start [options]

    ${chalk.bold('Options')}
      --help, -h       Display this message
      --port, -p       The port for the server to listen on
      --src            The directory with the source code
      --dist           A directory that will be created for build files
  `)
} else {
  const src = args['--src'] || './'
  const dist = args['--dist'] || '.frozone/'
  const port = args['--port'] || 3000

  ;(async () => {
    let errored = false
    
    try {
      log('Transforming JavaScript...')
      transformJavaScript(src, dist)
  
      log('Building pages...')
      await buildPages(dist, false)
  
      log('Copying static files...')
      copyStaticFiles(src, dist)
    } catch(error) {
      log('Error building!', true, 'red')
      log(error.message, true, 'red')
      errored = true
    }
    
    if (!errored) {
      startServer(port, dist)
      log(`Started server at http://localhost:${port}/`, true, 'green')
    }
  })()
}
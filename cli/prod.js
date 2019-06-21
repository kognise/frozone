const arg = require('arg')
const chalk = require('chalk')
const chain = require('../chain')

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
      --dist           The directory that will be temporarily created during build
  `)
} else {
  chain([
    require('../modules/build'),
    require('../modules/server')
  ], {
    src: args['--src'] || './',
    dist: args['--dist'] || 'dist/',
    port: args['--port'] || 3000
  })
}
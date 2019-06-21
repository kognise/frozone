const arg = require('arg')
const chalk = require('chalk')
const chain = require('../chain')

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
      --dist           The directory that will be temporarily created during build
  `)
} else {
  chain([
    require('../modules/build'),
    require('../modules/live'),
    require('../modules/server')
  ], {
    src: args['--src'] || './',
    dist: args['--dist'] || 'dist/',
    port: args['--port'] || 3000,
    lrPort: args['--lr-port'] || 3001
  })
}
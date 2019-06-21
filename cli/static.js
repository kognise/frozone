const arg = require('arg')
const chalk = require('chalk')
const chain = require('../chain')

const args = arg({
  '--help': Boolean,
  '--src': String,
  '--dist': String,
  '--out': String,

  '-h': '--help',
  '-o': '--out'
})

if (args['--help']) {
  console.log(`
    ${chalk.bold('Description')}
      Exports your site to static HTML files

    ${chalk.bold('Usage')}
      $ frozone export [options]

    ${chalk.bold('Options')}
      --help, -h       Display this message
      --out, -o        The directory to output built files
      --src            The directory with the source code
      --dist           The directory that will be temporarily created during build
  `)
} else {
  chain([
    require('../modules/build'),
    require('../modules/static')
  ], {
    src: args['--src'] || './',
    dist: args['--dist'] || 'dist/',
    out: args['--out'] || 'out/'
  })
}
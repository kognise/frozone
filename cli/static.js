const arg = require('arg')
const chalk = require('chalk')
const { log } = require('../util')
const {
  transformJavaScript, buildPages, copyStaticFiles,
  copyStaticBuild
} = require('../steps')

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
      --dist           A directory that will be created for build files
  `)
} else {
  const src = args['--src'] || './'
  const dist = args['--dist'] || '.frozone/'
  const out = args['--out'] || 'out/'

  let errored = false

  try {
    log('Transforming JavaScript...')
    transformJavaScript(src, dist)

    log('Building pages...')
    buildPages(dist)

    log('Copying static files...')
    copyStaticFiles(src, dist)

    log('Copying over static build...')
    copyStaticBuild(dist, out)
  } catch(error) {
    log('Error building!', true, 'red')
    log(error.message, true, 'red')
    errored = true
  }
  
  if (!errored) log(`Successfully completed static build`, true, 'green')
}
#!/usr/bin/env node

const arg = require('arg')
const chalk = require('chalk')
const pjson = require('../package.json')

const args = arg({
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}, { permissive: true })

switch (args._[0]) {
  case 'new':
  case 'create':
  case 'init': {
    require('./cli/init')
    break
  }

  case 'server':
  case 'start': {
    require('./cli/prod')
    break
  }

  case 'static':
  case 'build':
  case 'export': {
    require('./cli/static')
    break
  }

  case 'develop':
  case 'dev': {
    require('./cli/dev')
    break
  }

  default: {
    if (args['--help']) {
      console.log(`
    ${chalk.bold('Usage')}
      $ frozone <command> [options]

    ${chalk.bold('Commands')}
      dev, start, static, init

    ${chalk.bold('Options')}
      --help, -h       Display this message
      --version, -v    Show the version number

    For more information, run a command with the --help flag
  `)
    } else if (args['--version']) {
      console.log(`Frozone version ${pjson.version}`)
    } else {
      require('./cli/dev')
    }
  }
}
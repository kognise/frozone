#!/usr/bin/env node

import arg from 'arg'
import chalk from 'chalk'
import pjson from '../package.json'

const args = arg({
  '--help': Boolean,
  '--version': Boolean,

  '-h': '--help',
  '-v': '--version'
}, { permissive: false })

switch (args._[0]) {
  case 'new':
  case 'create':
  case 'init': {
    import './cli/init'
    break
  }

  case 'server':
  case 'start': {
    import './cli/prod'
    break
  }

  case 'static':
  case 'build':
  case 'export': {
    import './cli/static'
    break
  }

  case 'develop':
  case 'dev': {
    import './cli/dev'
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
      import './cli/dev'
    }
  }
}
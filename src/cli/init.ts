import arg from 'arg'
import chalk from 'chalk'
import fs from 'fs-extra'
import spawn from 'cross-spawn'
import { log } from '../util'
const pjson = require(`${__dirname}/../../package.json`)

const args = arg({
  '--help': Boolean,
  '--include-out': Boolean,
  '-h': '--help'
})

const projectName = args._[1]
if (args['--help']) {
  console.log(`
    ${chalk.bold('Description')}
      Initializes a new Frozone project

    ${chalk.bold('Usage')}
      $ frozone init <name> [options]

    ${chalk.bold('Options')}
      --help, -h       Display this message
      --include-out    Include the static build out directory in Git
  `)
} else if (!projectName) {
  log('You must specify a name for your new project!', true, 'red')
} else if (fs.existsSync(projectName)) {
  log('A directory with your project\'s name already exists!', true, 'red')
} else {
  log('Creating files...')
  fs.outputFileSync(`${projectName}/.gitignore`, `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# Optional NPM cache directory
.npm

# Optional ESLint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn integrity file
.yarn-integrity

# Dotenv environment variables
.env
.env.test

# Next.js build output
.next/

# Frozone build output
.frozone/${args['--include-out'] ? '' : '\nout/'}
  `.trim())
  fs.outputFileSync(`${projectName}/pages/index.js`, `
export default () => (
  <div>
    <h1>
      Hello, <span className='frozone'>Frozone</span>!
    </h1>

    <style jsx>{\`
      h1 {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        font-weight: 400;
        font-size: 3em;
        text-align: center;
        color: #ffffff;
      }
      .frozone {
        font-weight: 600;
        color: #22ffd3;
      }
    \`}</style>
    <style jsx global>{\`
      body {
        background: #000000;
      }
    \`}</style>
  </div>
)
  `.trim())
  fs.writeFileSync(`${projectName}/package.json`, JSON.stringify({
    name: projectName,
    scripts: {
      dev: 'frozone dev',
      start: 'frozone start',
      static: 'frozone export'
    },
    dependencies: {
      frozone: pjson.version
    }
  }, null, 2))

  log('Installing packages...')
  const command = spawn.sync('yarn', [ '--version' ])
  const useYarn = command.stdout && command.stdout.toString().trim()
  
  if (useYarn) {
    spawn.sync('yarn', [ '--cwd', `./${projectName}` ])
  } else {
    spawn.sync('npm', [ 'install', '--prefix', `./${projectName}` ])
  }

  log('Frozone project initialized!', true, 'green')
  console.log(`
    ${chalk.bold('Next steps')}
      $ cd ${projectName}
      $ ${useYarn ? 'yarn' : 'npm run'} dev

    For more information, run Frozone with the --help flag
  `)
}
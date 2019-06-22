const chalk = require('chalk')
const fs = require('fs-extra')
const rl = require('readline')
const endOfBodyRegex = /<\s*\/\s*body\s*>/

module.exports.esRequire = (path) => {
  const required = require(path)
  return required.__esModule ? required.default : required
}

module.exports.tree = (directory, files = [], root = directory.length) => {
  for (let item of fs.readdirSync(directory)) {
    const path = `${directory}/${item}`

    if (fs.statSync(`${directory}/${item}`).isDirectory()) {
      module.exports.tree(`${directory}/${item}`, files, root)
    } else {
      files.push(path.slice(root + 1))
    }
  }

  return files
}

module.exports.isJavaScript = (path) => /^.+\.(js|jsx|ts|tsx)$/.test(path)

module.exports.injectScript = (markup, script) => {
  if (endOfBodyRegex.test(markup)) {
    return markup.replace(endOfBodyRegex, `<script>${script}</script></body>`)
  } else {
    return `${markup}<script>${script}</script>`
  }
}

module.exports.log = (message, noReplace, color = 'blue') => {
  rl.cursorTo(process.stdout, 0)
  rl.clearLine(process.stdout)

  process.stdout.write(chalk[color](`> ${message}`))
  if (noReplace) process.stdout.write('\n')
}
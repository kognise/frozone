import chalk from 'chalk'
import fs from 'fs-extra'
import rl from 'readline'

const endOfBodyRegex = /<\s*\/\s*body\s*>/

export const esRequire = (path) => {
  import required from path
  return required.__esModule ? required.default : required
}

export const tree = (directory, files = [], root = directory.length) => {
  for (let item of fs.readdirSync(directory)) {
    const path = `${directory}/${item}`

    if (fs.statSync(`${directory}/${item}`).isDirectory()) {
      tree(`${directory}/${item}`, files, root)
    } else {
      files.push(path.slice(root + 1))
    }
  }

  return files
}

export const isCode = (config, path) => {
  for (let extension of config.codeExtensions) {
    if (path.endsWith(`.${extension}`)) return true
  }
  return false
}

export const injectScript = (markup, script) => {
  if (endOfBodyRegex.test(markup)) {
    return markup.replace(endOfBodyRegex, `<script>${script}</script></body>`)
  } else {
    return `${markup}<script>${script}</script>`
  }
}

export const log = (message, noReplace, color = 'blue') => {
  rl.cursorTo(process.stdout, 0)
  rl.clearLine(process.stdout)

  process.stdout.write(chalk[color](`> ${message}`))
  if (noReplace) process.stdout.write('\n')
}

export const getConfig = (src) => {
  const defaultBabelPresets = [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ],
    '@babel/preset-react'
  ]
  const defaultBabelPlugins = [ 'babel-plugin-react-require', 'styled-jsx/babel' ]
  const defaultCodeExtensions = [ 'js', 'jsx' ]

  let config = {}
  if (fs.existsSync(`${src}/frozone.config.js`)) {
    config = require(`${process.cwd()}/${src}/frozone.config.js`)
  }
  
  return {
    babelPresets: config.babelPresets ? defaultBabelPresets.concat(config.babelPresets) : defaultBabelPresets,
    babelPlugins: config.babelPlugins ? defaultBabelPlugins.concat(config.babelPlugins) : defaultBabelPlugins,
    codeExtensions: config.codeExtensions || defaultCodeExtensions,
    staticUseLinkSuffix: config.staticUseLinkSuffix === undefined ? true : config.staticUseLinkSuffix
  }
}
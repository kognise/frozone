import chalk from 'chalk'
import fs from 'fs-extra'
import rl from 'readline'

const endOfBodyRegex = /<\s*\/\s*body\s*>/

interface OptionalConfig {
  babelPresets?: any[]
  babelPlugins?: any[]
  codeExtensions?: string[]
  staticUseLinkSuffix?: boolean
}

export interface Config {
  babelPresets: any[]
  babelPlugins: any[]
  codeExtensions: string[]
  staticUseLinkSuffix: boolean
}

export const tree = (directory: string, files: string[] = [], root: number = directory.length): string[] => {
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

export const isCode = (config: Config, path: string) => {
  for (let extension of config.codeExtensions) {
    if (path.endsWith(`.${extension}`)) return true
  }
  return false
}

export const injectScript = (markup: string, script: string) => {
  if (endOfBodyRegex.test(markup)) {
    return markup.replace(endOfBodyRegex, `<script>${script}</script></body>`)
  } else {
    return `${markup}<script>${script}</script>`
  }
}

export const log = (message: string, noReplace?: boolean, color: string = 'blue') => {
  rl.cursorTo(process.stdout, 0)
  rl.clearLine(process.stdout, 1)

  // @ts-ignore: String can't index chalk
  process.stdout.write(chalk[color](`> ${message}`))
  if (noReplace) process.stdout.write('\n')
}

export const getConfig = (src: string): Config => {
  const defaultBabelPresets = [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ],
    '@babel/preset-react'
  ]
  const defaultBabelPlugins = [ 'babel-plugin-react-require', 'styled-jsx/babel' ]
  const defaultCodeExtensions = [ 'js', 'jsx' ]

  let config: OptionalConfig = {}
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